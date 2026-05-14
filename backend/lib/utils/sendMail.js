import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 465,
  secure: true,

  family: 4,

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
    // VERIFY SMTP CONNECTION
    await transporter.verify();

    console.log("SMTP READY");

    const info =
      await transporter.sendMail({
        from: `WhyteAfrican Shop <${process.env.EMAIL_USER}>`,
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