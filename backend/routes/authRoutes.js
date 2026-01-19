const express = require("express");
const router = express.Router();
const passport = require("passport");
const { protect } = require("../middlewares/authMiddleware");

// Business logic from authController
const {
  registerUser,
  loginUser,
  getUserDetails,
  editUserDetails,
  verifyUserEmail,
  googleCallback,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

// =====================
// Public Routes
// =====================

// Email/Password Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyUserEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Google OAuth Routes
// Step 1: Redirect to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google redirects back here after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=oauth_failed"
  }),
  googleCallback
);

// =====================
// Protected Routes
// =====================
router.get("/me", protect, getUserDetails);
router.put("/edit", protect, editUserDetails);

module.exports = router;

