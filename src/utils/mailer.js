import { createTransport } from "nodemailer";

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "kareemghorab3@gmail.com",
    pass: "yiopqjzdwojdxidh",
  },
});
