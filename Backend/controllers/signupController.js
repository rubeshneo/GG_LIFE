import bcrypt from "bcrypt";
import { findUserByEmail, createUser, findUserByRole } from "../services/userService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
} from "../utils/constants.js";

export const signup = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  const exists = await findUserByEmail(email);
  if (exists) {
    throw new ApiError(HTTP_BAD_REQUEST, "Email already exists");
  }

  // Check if admin already exists
  if (role === 'admin') {
    const adminExists = await findUserByRole('admin');
    if (adminExists) {
      throw new ApiError(HTTP_BAD_REQUEST, "An admin account already exists.");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role: role || "user"
  });

  return res.status(HTTP_CREATED).json(
    new ApiResponse(HTTP_CREATED, { userId: user._id }, "User registered successfully")
  );
});