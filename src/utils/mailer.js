import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = createTransport({
  service: "gmail",
  port:587,
  secure:false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
