const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// Business logic from authController
const {
  registerUser,
  loginUser,
  getUserDetails,
  editUserDetails
} = require("../controllers/authController");

// public routes we are not using middlewares here
router.post("/register", registerUser);
router.post("/login", loginUser);

// this is not a public route so we are using middleware protect for jwt token verification
router.get("/me", protect, getUserDetails);
router.put("/edit",protect, editUserDetails )
module.exports = router;
