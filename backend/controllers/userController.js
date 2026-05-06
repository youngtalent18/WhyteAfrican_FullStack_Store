import { sendResetEmail } from "../lib/utils/sendResetEmail.js";
import User from "../model/userModel.js";
import {generateTokens, setCookies} from "../lib/utils/generateToken.js"
import { sendVerificationEmail } from "../lib/utils/sendVerificationEmail.js";
import { sendEmail } from "../lib/utils/sendMail.js";
import {redis} from "../config/redis.js"
import crypto from "crypto";


const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    { EX: 7 * 24 * 60 * 60 }
  );
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ Create user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    // 🔐 Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.verifyToken = hashedToken;
    user.verifyTokenExpire = Date.now() + 1000 * 60 * 60; // 1 hour

    await user.save();

    // 📩 Send verification email
    try {
      await sendVerificationEmail(user, verifyToken);
    } catch (emailErr) {
      console.log("EMAIL ERROR:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Account created. Check your email to verify.",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔐 EMAIL VERIFICATION CHECK 
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if(refreshToken){
        await redis.del(`refresh_token:${req.user._id}`);
    }

    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function refresh_token(req,res){
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({success: false, message: "No refresh token provided"});
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);
        if(storedToken !== refreshToken){
            return res.status(403).json({error: "Invalid refresh token"});
        }

        const {accessToken} = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN, {expiresIn: "15m"});

        res.cookie("accessToken", accessToken, {
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 15*60*1000,
        });

        res.status(200).json({success: true, message: "Access token refreshed"});

    }catch(error){
        console.log("Error in refresh token controller", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        console.log("Error in getUserProfile controller", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15;

    await user.save();

    // 🔥 USE YOUR WRAPPER
    try {
      await sendResetEmail(user, resetToken);
    } catch (emailErr) {
      console.log("EMAIL ERROR:", emailErr.message);
      // optional: clear token if email fails
    }

    res.json({ message: "Reset link sent to email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//verify user logic
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    // ✅ Activate account
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;

    await user.save();

    // 🔥 AUTO LOGIN
    const { accessToken, refreshToken } = await generateTokens(user._id);

    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//resend verification logic
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // ================= VALIDATION =================
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ================= RATE LIMIT =================
    const cooldownKey = `resend_verify:${normalizedEmail}`;

    const ttl = await redis.ttl(cooldownKey);

    // 🔥 If still cooling down → send remaining time
    if (ttl > 0) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${ttl}s before requesting another email`,
        retryAfter: ttl, // 🔥 frontend uses this
      });
    }

    // Set cooldown (60 seconds)
    await redis.set(cooldownKey, "1", { EX: 60 });

    // ================= FIND USER =================
    const user = await User.findOne({ email: normalizedEmail });

    // 🔐 Prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a verification email has been sent",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    // ================= TOKEN =================
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.verifyToken = hashedToken;
    user.verifyTokenExpire = Date.now() + 1000 * 60 * 60; // 1 hour

    await user.save();

    // ================= SEND EMAIL =================
    try {
      await sendVerificationEmail(user, verifyToken, true);
    } catch (emailErr) {
      console.log("EMAIL ERROR:", emailErr.message);
      // ❗ don't fail request because email failed
    }

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
      retryAfter: 60, // 🔥 optional: start frontend countdown immediately
    });

  } catch (error) {
    console.log("Resend verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
