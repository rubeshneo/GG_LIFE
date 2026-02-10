import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  HTTP_NOT_FOUND,
} from "../utils/constants.js";
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(HTTP_UNAUTHORIZED, "Invalid password");
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(HTTP_OK).json(
    new ApiResponse(HTTP_OK, {
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        email: user.email
      }
    }, "Login successful")
  );
});
