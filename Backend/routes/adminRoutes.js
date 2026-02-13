import express from "express";
import { getAuditLogs, getActiveUsers, deleteAuditLog, deleteAllAuditLogs } from "../controllers/adminController.js";
import authmiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authmiddleware);

router.get("/audit-log", getAuditLogs);
router.get("/active-users", getActiveUsers);
router.delete("/audit-log/:id", deleteAuditLog);
router.delete("/audit-log-delete", deleteAllAuditLogs);

export default router;
