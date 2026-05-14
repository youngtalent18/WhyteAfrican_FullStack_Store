import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: Number(process.env.EMAIL_PORT),

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    // VERIFY CONNECTION
    await transporter.verify();

    console.log("SMTP READY");

    const info =
      await transporter.sendMail({
        from: `"WhyteAfrican Shop" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

    console.log(
      "EMAIL SENT:",
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );

    throw error;
  }
};