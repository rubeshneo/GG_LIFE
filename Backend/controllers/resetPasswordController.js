import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_OK, HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from "../utils/constants.js";

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new ApiError(HTTP_UNAUTHORIZED, "No reset token provided");

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(HTTP_UNAUTHORIZED, "Invalid or expired reset token");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(HTTP_BAD_REQUEST, "Passwords do not match");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(decoded.userId, {
    password: hashed,
    resetCode: null,
    resetCodeExpiry: null,

    wrongAttempts: 0,
    isLocked: false,
    isActive: true
  });

  return res
    .status(HTTP_OK)
    .json(new ApiResponse(HTTP_OK, null, "Password reset successful"));
});
