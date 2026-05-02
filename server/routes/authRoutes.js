import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  profile,
  refreshToken,
  register,
  resetPassword,
  updateProfile,
  verifyEmail,
  verifyOtp
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);

export default router;
