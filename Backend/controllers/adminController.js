import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_OK, HTTP_NOT_FOUND } from "../utils/constants.js";
import { deleteAuditLogById, clearAllAuditLogs } from "../services/auditService.js";


export const getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find().sort({ timestamp: -1 });

    return res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, logs, "Audit logs fetched successfully")
    );
});


export const getActiveUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");

    return res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, users, "Active users fetched successfully")
    );
});

// @desc    Delete a specific audit log
// @route   DELETE /api/admin/audit-log/:id
// @access  Private (Admin)
export const deleteAuditLog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // We can check existence inside the service or here. 
    // Usually services return null if not found.
    const deleted = await deleteAuditLogById(id);

    if (!deleted) {
        throw new ApiError(HTTP_NOT_FOUND, "Audit log not found");
    }

    return res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, null, "Audit log deleted successfully")
    );
});

// @desc    Delete all audit logs
// @route   DELETE /api/admin/audit-log-delete
// @access  Private (Admin)
export const deleteAllAuditLogs = asyncHandler(async (req, res) => {
    await clearAllAuditLogs();

    return res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, null, "All audit logs deleted successfully")
    );
});
