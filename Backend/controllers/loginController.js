import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/userService.js";
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

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  if (!user.isActive || user.isLocked) {
    throw new ApiError(
      HTTP_UNAUTHORIZED,
      "Account locked after 3 attempts. Use Forgot Password."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.wrongAttempts += 1;
    if (user.wrongAttempts >= 3) {
      user.isLocked = true;
      user.isActive = false;
    }

    await user.save();

    throw new ApiError(
      HTTP_UNAUTHORIZED,
      user.isLocked
        ? "Account locked after 3 attempts. Use Forgot Password."
        : `Invalid password. Attempts left: ${3 - user.wrongAttempts}`
    );
  }

  user.wrongAttempts = 0;
  user.isLocked = false;
  user.isActive = true;
  await user.save();
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
