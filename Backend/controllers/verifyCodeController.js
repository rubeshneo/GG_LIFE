import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  HTTP_OK,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
} from "../utils/constants.js";
export const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  if (user.code !== code) {
    throw new ApiError(HTTP_BAD_REQUEST, "Invalid verification code");
  }

  if (Date.now() > user.codeExpiry) {
    throw new ApiError(HTTP_BAD_REQUEST, "Verification code expired");
  }

  //Verification code Success then Issue JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  //Clearing the code after successful verification
  user.code = null;
  user.codeExpiry = null;
  await user.save();

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, { token }, "Verification successful")
  );
});