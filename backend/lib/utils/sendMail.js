import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: "stephenanti63@gmail.com", // must verify sender later
      subject,
      html,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Email error:", error.response?.body || error);
    throw new Error("Email failed");
  }
};