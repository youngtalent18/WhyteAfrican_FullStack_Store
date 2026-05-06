import { sendEmail } from "../utils/sendMail.js";

export const sendResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>

      <a href="${resetUrl}" 
         style="display:inline-block;padding:10px 20px;background:#06b6d4;color:#000;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html,
  });
};