import express from "express";
import { signup, login, sendCode, verifyCode, resendCode, forgotPassword, verifyForgotPassword, resetPassword, logout } from "../controllers/authController.js";
import authmiddleware from "../middleware/authmiddleware.js";
import {
  validateSignup,
  validateLogin,
  validateSendCode,
  validateVerifyCode,
  validateResendCode,
  validateForgotPasswordEmail,
  validateForgotPasswordCode,
  validateResetPassword
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/send-code", validateSendCode, sendCode);
router.post("/verify-code", validateVerifyCode, verifyCode);
router.post("/resend-code", validateResendCode, resendCode);
router.post("/forgot-password", validateForgotPasswordEmail, forgotPassword);
router.post("/verify-forgot-password-code", validateForgotPasswordCode, verifyForgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);
router.post("/logout", authmiddleware, logout);
router.get("/profile", authmiddleware, (req, res) => {
  res.json({ message: "Protected", userId: req.userId });
});

export default router;
