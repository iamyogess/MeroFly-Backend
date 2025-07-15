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
  fullName
) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: "MeroFly",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification Code",
      html: getVerificationEmailTemplate(fullName, verificationCode),
    };

    const result = await transporter.sendMail(mailOptions);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending verification email!", error);
    return { success: false, error: error.message };
  }
};
