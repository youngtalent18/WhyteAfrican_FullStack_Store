// controllers/couponController.js

import Coupon from "../model/couponModel.js";
import User from "../model/userModel.js";

const LOYALTY_REDEEM_POINTS = 100;
const LOYALTY_DISCOUNT_PERCENTAGE = 5;
const LOYALTY_COUPON_DAYS = 30;

// ===============================
// GET COUPON (USER + GLOBAL)
// ===============================
export const getCoupon = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔵 USER COUPON FIRST
    const userCoupon = await Coupon.findOne({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (userCoupon) {
      return res.json(userCoupon);
    }

    // 🟢 GLOBAL COUPON FALLBACK
    const globalCoupon = await Coupon.findOne({
      userId: null,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!globalCoupon) {
      return res.status(404).json({
        message: "No active coupon found",
      });
    }

    res.json(globalCoupon);

  } catch (error) {
    console.error("GET COUPON ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// VALIDATE COUPON
// ===============================
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
      $or: [
        { userId: null }, // GLOBAL
        { userId },       // USER
      ],
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid or expired coupon",
      });
    }

    res.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });

  } catch (error) {
    console.error("VALIDATE COUPON ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// ADMIN CREATE COUPON
// ===============================
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      expiresAt,
      userId, // optional
    } = req.body;

    if (!code || !discountPercentage || !expiresAt) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercentage,
      expiresAt,
      userId: userId || null, // 🔥 GLOBAL if null
      isActive: true,
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });

  } catch (error) {
    console.error("CREATE COUPON ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET ALL COUPONS (ADMIN)
// ===============================
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json(coupons);
  } catch (error) {
    console.error("GET ALL COUPONS ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// TOGGLE ACTIVE
// ===============================
export const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json(coupon);

  } catch (error) {
    console.error("TOGGLE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// DELETE COUPON
// ===============================
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    await Coupon.findByIdAndDelete(id);

    res.json({ message: "Coupon deleted" });

  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// REDEEM LOYALTY POINTS
// ===============================
export const redeemLoyaltyCoupon = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if ((user.loyaltyPoints || 0) < LOYALTY_REDEEM_POINTS) {
      return res.status(400).json({
        message: `You need ${LOYALTY_REDEEM_POINTS} points to redeem a loyalty discount`,
      });
    }

    const code = `LOYAL${user.referralCode || user._id.toString().slice(-6)}${Date.now()
      .toString(36)
      .toUpperCase()}`;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + LOYALTY_COUPON_DAYS);

    user.loyaltyPoints -= LOYALTY_REDEEM_POINTS;
    await user.save();

    const coupon = await Coupon.create({
      code,
      discountPercentage: LOYALTY_DISCOUNT_PERCENTAGE,
      expiresAt,
      userId: user._id,
      isActive: true,
      usageLimit: 1,
      perUserLimit: 1,
    });

    res.status(201).json({
      message: "Loyalty discount redeemed",
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        expiresAt: coupon.expiresAt,
      },
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        referralCount: user.referralCount,
        loyaltyPoints: user.loyaltyPoints,
        lifetimeLoyaltyPoints: user.lifetimeLoyaltyPoints,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("REDEEM LOYALTY ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
