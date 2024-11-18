import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AppError, catchAsyncError } from "../../utils/error.handler.js";
import userModel from "../user/models/user.model.js";
import { transporter } from "../../utils/mailer.js";
dotenv.config();
export const signin = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password))
    throw new AppError("Invalid credentials", 400);

  if (!user.isEmailVerified)
    throw new AppError("please Verifiy Your Email first");

  const { name, role, _id: id } = user;
  const token = jwt.sign({ name, role, id, email }, process.env.SECRET);
  res.json({ token });
});

export const signup = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;
  const email_token = jwt.sign({ email }, process.env.SECRET_EMAIL);
  const link = process.env.LINK + `api/v1/auth/validate/${email_token}`;
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "confirm Email",
    text: "confirm your  Email",
    html: `<a href=${link}>Click to vrify Email</a>`,
  });
  const hashed = bcrypt.hashSync(password, +process.env.SALT);

  await userModel.create({
    name,
    email,
    password: hashed,
  });
  res.status(201).json({
    message: "Signed up successfully",
    tokenToCheackVerifiy: email_token,
  });
});

export const validateEmail = catchAsyncError(async (req, res) => {
  const { token } = req.params;
  try {
    const { email } = jwt.verify(token, process.env.SECRET_EMAIL);
    await userModel.findOneAndUpdate({ email }, { isEmailVerified: true });
    res.send("Email verified sucess");
  } catch (error) {
    throw new AppError(error.message, 400);
  }
});
export const checkIsEmailVerified = catchAsyncError(async (req, res) => {
  const { token } = req.params;
  try {
    const { email } = jwt.verify(token, process.env.SECRET_EMAIL);
    const user = await userModel.findOne({ email });
    res.json({ isVerifiy: user.isEmailVerified });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
});
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const resetToken = jwt.sign({ email }, process.env.SECRET_RESET_PASSWORD, {
    expiresIn: "1h",
  });

  const resetLink = `${process.env.LINK}api/v1/auth/reset-password/${resetToken}`;

  // Send reset password email
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password",
    text: "You requested to reset your password.",
    html: `<a href="${resetLink}">Click here to reset your password</a>`,
  });

  res
    .status(200)
    .json({ message: "Reset password link has been sent to your email" });
});

// Function to reset password
export const resetPassword = catchAsyncError(async (req, res) => {
  const { token } = req.params;
  // const  newPassword  = generator.generate({
  //   length: 10,
  //   numbers: true
  // });;

  // Verify the reset password token
  const decoded = jwt.verify(token, process.env.SECRET_RESET_PASSWORD);

  // Find user by email
  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Hash the new password
  // const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT);

  // // Update user's password
  // await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  res.render("signin.ejs", { token });

  //res.status(200).json({ message: `this is new password : ${newPassword} please sign in and update it with new ` });
});
export const handlePassword = catchAsyncError(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(token);

  // Verify the reset password token
  const decoded = jwt.verify(token, process.env.SECRET_RESET_PASSWORD);

  // Find user by email
  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);

  // // Update user's password
  await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  res.json({ message: "Sucesss" });
});
