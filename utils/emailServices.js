import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "../templates/emailTemplates.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendVerificationEmail = async (
  email,
  verificationCode,
  firstName
) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: "Merofly",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification Code",
      html: getVerificationEmailTemplate(firstName, verificationCode),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("Verification email sent!", result.messageId);
  } catch (error) {
    console.error("Error sending verification email!");
    return { success: false, error: error.message };
  }
};
