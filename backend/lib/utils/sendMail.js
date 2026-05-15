import nodemailer from "nodemailer";

const requiredEnv = [
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.warn(
    `Email configuration is incomplete. Missing: ${missingEnv.join(", ")}`
  );
}

const emailPort = Number(process.env.EMAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: emailPort,

  secure: emailPort === 465,

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
      info.messageId,
      {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      }
    );

    if (info.rejected?.length) {
      throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
    }

    return info;

  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );

    throw error;
  }
};
