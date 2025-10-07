const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // User's name
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },
  // User's email (must be unique for login)
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    lowercase: true,
  },
  // Password for authentication
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  // Role for access control (e.g., 'customer', 'admin', 'store_owner')
  role: {
    type: String,
    default: "customer",
    enum: ["customer", "admin"],
  },
  // Reference to all orders placed by this user (One-to-many relationship)
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
