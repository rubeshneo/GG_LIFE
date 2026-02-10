import User from "../models/User.js";
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  HTTP_OK,
  HTTP_NOT_FOUND,
} from "../utils/constants.js";
export const sendCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 Digit OTP
  const expiry = Date.now() + 1 * 60 * 1000; // 1 minute

  user.code = code;
  user.codeExpiry = expiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}. It is valid for 1min.`
  });

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, null, "Verification code sent successfully")
  );
});
