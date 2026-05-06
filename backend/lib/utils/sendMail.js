import { Resend } from "resend";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "WhyteAfrican Emporium <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email could not be sent");
  }
};