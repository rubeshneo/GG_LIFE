import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    userRole: {
        type: String,
        default: "unknown"
    },
    userName: {
        type: String,
        default: "Unknown"
    },
    wrongAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    action: {
        type: String,
        required: true,
        enum: ["LOGIN_ATTEMPT", "LOGIN_SUCCESS", "LOGIN_FAILURE"],
    },
    status: {
        type: String,
        enum: ["SUCCESS", "FAILURE"],
        required: true,
    },
    ipAddress: {
        type: String,
        default: "Unknown",
    },
    userAgent: {
        type: String,
        default: "Unknown",
    },
    location: {
        type: String,
        default: "Unknown",
    },
    deviceType: {
        type: String,
        default: "Unknown", // Desktop, Mobile, Tablet
    },
    os: {
        type: String,
        default: "Unknown", // Windows, Mac, Android, iOS
    },
    browser: {
        type: String,
        default: "Unknown", // Chrome, Firefox, Safari
    },
    details: {
        type: String,
        default: "",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;

