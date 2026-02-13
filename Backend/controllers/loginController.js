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
import { logAudit } from "../services/auditService.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const ipAddress = req.ip || req.headers["x-forwarded-for"] || "Unknown";
  const userAgent = req.headers["user-agent"] || "Unknown";

  const user = await findUserByEmail(email);

  if (!user) {
    await logAudit({
      email,
      action: "LOGIN_FAILURE",
      status: "FAILURE",
      ipAddress,
      userAgent,
      details: "User not found",
    });
    throw new ApiError(HTTP_NOT_FOUND, "User not found");
  }

  // Check if account is locked
  if (!user.isActive || user.isLocked) {
    await logAudit({
      email,
      userId: user._id,
      action: "LOGIN_FAILURE",
      status: "FAILURE",
      ipAddress,
      userAgent,
      details: "Account locked",
      userRole: user.role,
      userName: user.firstname,
      wrongAttempts: user.wrongAttempts,
      isLocked: user.isLocked,
      isActive: user.isActive
    });
    throw new ApiError(
      HTTP_UNAUTHORIZED,
      "Account locked after 3 attempts. Use Forgot Password."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.wrongAttempts += 1;
    let details = "Invalid password";

    if (user.wrongAttempts >= 3) {
      user.isLocked = true;
      user.isActive = false;
      details = "Account locked due to too many failed attempts";
    }

    await user.save();

    await logAudit({
      email,
      userId: user._id,
      action: "LOGIN_FAILURE",
      status: "FAILURE",
      ipAddress,
      userAgent,
      details,
      userRole: user.role,
      userName: user.firstname,
      wrongAttempts: user.wrongAttempts,
      isLocked: user.isLocked,
      isActive: user.isActive
    });

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

  await logAudit({
    email,
    userId: user._id,
    action: "LOGIN_SUCCESS",
    status: "SUCCESS",
    ipAddress,
    userAgent,
    details: "Login successful",
    userRole: user.role,
    userName: user.firstname,
    wrongAttempts: user.wrongAttempts,
    isLocked: user.isLocked,
    isActive: user.isActive
  });

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
        email: user.email,
        role: user.role,
      }
    }, "Login successful")
  );
});
