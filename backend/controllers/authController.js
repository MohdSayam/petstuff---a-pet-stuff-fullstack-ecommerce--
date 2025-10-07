const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");

// Register a new user and return a JWT token
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  try {
    // 1. Check if user exists
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // 5. Create payload for JWT nothin bt the user id so we can identify the user in future
    const payload = {
      user: {
        id: newUser.id,
      },
    };

    // 6. Sign JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 7. Send token back to frontend it will save it to local storage
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user and match jwt token
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //user check
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist sign up first" });
    }

    // confirm the user
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // create payload and jwt token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in login" });
  }
};

// get user details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in get user details" });
  }
};

module.exports = { registerUser, loginUser, getUserDetails };
