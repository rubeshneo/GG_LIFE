import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_OK, HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from "../utils/constants.js";
import { findUserByEmail } from "../services/userService.js";

export const verifyForgotPassword = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  if (user.resetCode !== code) {
    throw new ApiError(HTTP_BAD_REQUEST, "Invalid reset code");
  }

  if (Date.now() > user.resetCodeExpiry) {
    throw new ApiError(HTTP_BAD_REQUEST, "Reset code expired");
  }

  // Create temporary reset token (valid for 5 minutes)
  const resetToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, { resetToken }, "Code verified, proceed to reset password")
  );
});
