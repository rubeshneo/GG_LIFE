import { logAudit } from "../services/auditService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_OK } from "../utils/constants.js";
import { findUserById } from "../services/userService.js";

export const logout = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";

    const user = await findUserById(userId);

    if (user) {
        await logAudit({
            email: user.email,
            userId: user._id,
            action: "LOGOUT",
            status: "SUCCESS",
            ipAddress,
            userAgent,
            details: "Logout successful",
            userRole: user.role,
            userName: user.firstname,
            wrongAttempts: user.wrongAttempts,
            isLocked: user.isLocked,
            isActive: user.isActive
        });
    }

    // Even if user not found (unlikely if token valid), we return success
    return res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, {}, "Logout successful")
    );
});
