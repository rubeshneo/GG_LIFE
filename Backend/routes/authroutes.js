import express from "express";
import { signup, login, sendCode, verifyCode, resendCode } from "../controllers/authcontroller.js";
import authmiddleware from "../middleware/authmiddleware.js";
import {
  validateSignup,
  validateLogin,
  validateSendCode,
  validateVerifyCode,
  validateResendCode
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/send-code", validateSendCode, sendCode);
router.post("/verify-code", validateVerifyCode, verifyCode);
router.post("/resend-code", validateResendCode, resendCode);
router.get("/profile", authmiddleware, (req, res) => {
  res.json({ message: "Protected", userId: req.userId });
});

export default router;
