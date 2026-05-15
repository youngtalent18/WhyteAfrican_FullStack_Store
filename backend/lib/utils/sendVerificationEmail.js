import { sendEmail } from "../utils/sendMail.js";
export const sendVerificationEmail = async (user, token, isResend = false) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}?email=${encodeURIComponent(user.email)}`;

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>${isResend ? "Verify your email (Resent)" : "Welcome 👋"}</h2>
      <p>Click below to verify your account:</p>

      <a href="${verifyUrl}" 
         style="display:inline-block;padding:10px 20px;background:#06b6d4;color:#000;text-decoration:none;border-radius:5px;">
         Verify Email
      </a>

      <p>This link expires in 1 hour.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: isResend ? "Verify your account (resend)" : "Verify your account",
    html,
  });
};
