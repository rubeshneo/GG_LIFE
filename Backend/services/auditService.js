import AuditLog from "../models/AuditLog.js";

/**
 * Log an audit event.
 * @param {Object} logData - The data to log.
 * @param {string} logData.email - User email.
 * @param {string} [logData.userId] - User ID (optional).
 * @param {string} logData.action - Action type.
 * @param {string} logData.status - Status (SUCCESS/FAILURE).
 * @param {string} [logData.ipAddress] - IP Address.
 * @param {string} [logData.userAgent] - User Agent string.
 * @param {string} [logData.details] - Additional details.
 */
export const logAudit = async (logData) => {
    try {
        const { userAgent, ipAddress, userRole, userName, wrongAttempts, isLocked, isActive } = logData;
        let os = "Unknown";
        let browser = "Unknown";
        let deviceType = "Desktop";
        let location = "Unknown";

        // Basic User Agent Parsing
        if (userAgent) {
            // OS Detection
            if (userAgent.includes("Windows")) os = "Windows";
            else if (userAgent.includes("Mac")) os = "MacOS";
            else if (userAgent.includes("Linux")) os = "Linux";
            else if (userAgent.includes("Android")) os = "Android";
            else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

            // Browser Detection (Order matters!)
            if (userAgent.includes("Edg")) browser = "Edge";
            else if (userAgent.includes("Chrome")) browser = "Chrome";
            else if (userAgent.includes("Firefox")) browser = "Firefox";
            else if (userAgent.includes("Safari")) browser = "Safari";

            // Device Type
            if (userAgent.includes("Mobile") || userAgent.includes("Android") || userAgent.includes("iPhone")) {
                deviceType = "Mobile";
            }
        }

        // Basic IP Location Logic (Simulated for localhost)
        if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
            location = "Local Machine (Development)";
        }

        await AuditLog.create({
            ...logData,
            os,
            browser,
            deviceType,
            location,
            userRole: userRole || "unknown",
            userName: userName || "Unknown",
            wrongAttempts: wrongAttempts !== undefined ? wrongAttempts : 0,
            isLocked: isLocked !== undefined ? isLocked : false,
            isActive: isActive !== undefined ? isActive : true
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
    }
};

/**
 * Delete an audit log by its ID.
 * @param {string} id - The ID of the audit log to delete.
 * @returns {Promise<Object|null>} The deleted document, or null if not found.
 */
export const deleteAuditLogById = async (id) => {
    return await AuditLog.findByIdAndDelete(id);
};

/**
 * Delete all audit logs.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const clearAllAuditLogs = async () => {
    return await AuditLog.deleteMany({});
};

