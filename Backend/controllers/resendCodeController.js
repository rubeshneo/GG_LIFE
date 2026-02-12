import { findUserByEmail, saveUser } from "../services/userService.js";
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  HTTP_OK,
  HTTP_NOT_FOUND,
} from "../utils/constants.js";
export const resendCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  // Generate new Verification Code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = Date.now() + 1 * 60 * 1000;

  user.code = code;
  user.codeExpiry = expiry;
  await saveUser(user);

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
    subject: "Your New Verification Code",
    text: `Your new verification code is ${code}. It expires in 1 minute.`,
  });

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, null, "Verification code resent successfully!")
  );
});