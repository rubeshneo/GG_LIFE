import express from "express";
import { getMessages } from "../controllers/messageController.js";
import authmiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/:userId", authmiddleware, getMessages);

export default router;
