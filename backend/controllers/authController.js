const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

// Register a new user 
const registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
  try {
    if (!name || !email || !password || !confirmPassword) {
      res.status(400);
      return next(new Error("Please provide all details"));
    }

    const userCheck = await User.findOne({ email });
    if (userCheck) {
      res.status(400);
      return next(new Error("User already exists"));
    }

    if (password !== confirmPassword) {
      res.status(400);
      return next(new Error("Passwords do not match"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate and hash verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    // Create user with verification token
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken: verificationTokenHash,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 Hours
    });

    await newUser.save();

    // Build verification URL
    const verifyUrl = `http://localhost:5173/verify-email/${verifyToken}`;

    const message = `Welcome to PetStuff! 🐾\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "PetStuff - Verify your email",
        message: message
      });

      res.status(200).json({
        success: true,
        message: "Registration successful! Please check your email to verify account."
      });

    } catch (emailError) {
      // Rollback on email failure
      await User.findByIdAndDelete(newUser._id);
      return next(new Error("Email could not be sent. Registration failed."));
    }

  } catch (error) {
    next(error);
  }
};

// Login user and match jwt token
const loginUser = async (req, res, next) => {

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return next(new Error("Email or password incorrect!"));
    }

    if (!user.isVerified) {
      res.status(401)
      return next(new Error("Please verify your email before logging in."))
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }

    // Generate JWT
    const payload = { user: { id: user.id } };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    return next(new Error("Login failed due to unexpected server error."));
  }
};

// verification controller
const verifyUserEmail = async (req, res, next) => {
  const { token } = req.params;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    // Check if user exists with valid token
    if (!user) {
      res.status(400);
      return next(new Error("Invalid or expired verification token"));
    }

    // verify user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can login now"
    });
  } catch (err) {
    next(err);
  }
};

// get user details
const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404);
      return next(new Error("user not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// edit user details 
const editUserDetails = async (req, res, next) => {
  const {
    name,
    email,
    oldPassword,
    newPassword,
    confirmNewPassword
  } = req.body;

  try {
    // Get user
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(404)
      return next(new Error("User not found"))
    }

    let isUpdated = false;

    // Update name
    if (name && name !== user.name) {
      user.name = name
      isUpdated = true;
    }

    // Update email
    if (email && email !== user.email) {
      const isEmailExists = await User.findOne({ email });
      if (isEmailExists) {
        res.status(400)
        return next(new Error("Email already in use"))
      }
      user.email = email
      isUpdated = true
    }

    // password update logic
    if (oldPassword || newPassword || confirmNewPassword) {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        res.status(400)
        return next(new Error("All password fields are required!"));
      }

      const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isOldPasswordMatch) {
        res.status(400)
        return next(new Error("Old password is incorrect"))
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password)
      if (isSamePassword) {
        res.status(400)
        return next(new Error("New password must be different from old password"))
      }

      if (newPassword !== confirmNewPassword) {
        res.status(400)
        return next(new Error("Both passwords must be same"))
      }

      user.password = await bcrypt.hash(newPassword, 10)
      isUpdated = true;
    }

    // No changes check
    if (!isUpdated) {
      res.status(400)
      return next(new Error("No changes deteckted to update"))
    }
    await user.save();

    // save user finally
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message: "User updated successfully!",
      user: updatedUser // This now includes createdAt, _id, etc.
    });

  } catch (error) {
    console.error(error)
    res.status(500)
    return next(new Error("Failed to update profile!"))
  }
}

// Google OAuth callback - issues JWT after successful auth
const googleCallback = async (req, res, next) => {
  try {
    // req.user is populated by Passport after successful authentication
    const user = req.user;

    // Create JWT token (same as regular login)
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d", // Longer expiry for OAuth users
    });

    // Redirect to frontend with token in URL
    // Frontend will extract token and store it
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);

  } catch (error) {
    console.error("Google callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};

// Resend Verification Email
const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400);
      return next(new Error("Please provide your email"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return next(new Error("User not found with this email"));
    }

    if (user.isVerified) {
      res.status(400);
      return next(new Error("Email is already verified"));
    }

    // Generate new verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.verificationToken = verificationTokenHash;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyUrl = `http://localhost:5173/verify-email/${verifyToken}`;
    const message = `Hi ${user.name}! 🐾\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`;

    await sendEmail({
      email: user.email,
      subject: "PetStuff - Verify your email",
      message: message
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully!"
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    next(error);
  }
};

// Forgot password - sends reset email
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400);
      return next(new Error("Please provide an email address"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists - security
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Check if user is Google OAuth only
    if (user.googleId && !user.password) {
      res.status(400);
      return next(new Error("This account uses Google Sign-In. Please login with Google."));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Build reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `Hi ${user.name}! 🐾\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "PetStuff - Reset your password",
        message: message
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully!"
      });

    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return next(new Error("Email could not be sent. Please try again."));
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

// Reset password - validates token and updates password
const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    if (!password || !confirmPassword) {
      res.status(400);
      return next(new Error("Please provide password and confirm password"));
    }

    if (password !== confirmPassword) {
      res.status(400);
      return next(new Error("Passwords do not match"));
    }

    if (password.length < 6) {
      res.status(400);
      return next(new Error("Password must be at least 6 characters"));
    }

    // Hash token to compare
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      return next(new Error("Invalid or expired reset token"));
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};


module.exports = {
  registerUser,
  loginUser,
  verifyUserEmail,
  getUserDetails,
  editUserDetails,
  googleCallback,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
};

