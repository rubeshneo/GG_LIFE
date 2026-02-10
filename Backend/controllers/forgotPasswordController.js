import User from "../models/User.js";
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_OK, HTTP_NOT_FOUND } from "../utils/constants.js";

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

  user.resetCode = code;
  user.resetCodeExpiry = expiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is ${code}. It is valid for 10 minutes.`,
  });

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, null, "Password reset code sent successfully")
  );
});
