import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessTokenController,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login", loginUser);
router.get("/refresh-token", refreshAccessTokenController);
router.post("/logout", logoutUser);

export default router;
