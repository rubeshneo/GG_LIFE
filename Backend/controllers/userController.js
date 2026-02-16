import { findAllUsers } from "../services/userService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_OK } from "../utils/constants.js";

export const getNonAdminUsers = asyncHandler(async (req, res) => {
    // Fetch all users where role is NOT "admin"
    // Assuming 'role' field exists and 'admin' is the value for admins
    const users = await findAllUsers({ role: { $ne: "admin" } });

    // Filter out sensitivity data just in case, though service might return docs
    const sanitizedUsers = users.map(user => ({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname, // if exists
        email: user.email,
        role: user.role
    }));

    return res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, sanitizedUsers, "Users fetched successfully")
    );
});
