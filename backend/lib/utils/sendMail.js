import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `WhyteAfrican Shop <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", info.messageId);

    return info;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};