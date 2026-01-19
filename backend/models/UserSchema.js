const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // Optional for Google OAuth users
  role: { type: String, default: "customer", enum: ["customer", "admin"] },
  orders: [{ type: mongoose.Schema.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now },

  // Email verification & OAuth fields
  isVerified: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  verificationToken: String,
  verificationTokenExpires: Date,

  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model("User", userSchema);