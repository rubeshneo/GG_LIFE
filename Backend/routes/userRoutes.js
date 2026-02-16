import express from "express";
import { getNonAdminUsers } from "../controllers/userController.js";
import authmiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Protect all routes
router.use(authmiddleware);

router.get("/", getNonAdminUsers);

export default router;
