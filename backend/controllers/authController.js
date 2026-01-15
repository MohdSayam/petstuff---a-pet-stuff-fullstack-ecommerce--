const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");

// Register a new user and return a JWT token
const registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
  try {
    const checkAllDetails = !name || !email || !password || !confirmPassword;
    if (checkAllDetails) {
      res.status(400);
      return next(new Error("Please provide all details"));
    }
    // 1. Check if user exists
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      res.status(400);
      return next(new Error("User already exists"));
    }

    // 2. Validate password match
    if (password !== confirmPassword) {
      res.status(400);
      return next(new Error("Passwords do not match"));
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
    res.status(500);

    // here we can pass unexpected error like db failure or server error to the middleware
    next(error);
  }
};

// Login user and match jwt token
const loginUser = async (req, res, next) => {

  const { email, password } = req.body;

  try {
    // uuser check
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return next(new Error("Email or password incorrect!"));
    }

    //  confirm the user (password match)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }

    //  create payload and jwt token
    const payload = { user: { id: user.id } };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //Send token
    return res.status(200).json({
       token,
       user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
       } 
      });
  } catch (error) {
    console.error(error);
    res.status(500);
    return next(new Error("Login failed due to unexpected server error."));
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

    try{ 
    // 1: get logged in user
    const user = await User.findById(req.user.id)
    if (!user){
      res.status(404)
      return next(new Error("User not found"))
    }

    let isUpdated = false;

    // 2: name update logic
    if (name && name !== user.name){
      user.name = name
      isUpdated = true;
    }

    // 3: email update logic
    if (email && email !== user.email){
      const isEmailExists = await User.findOne({email});
      if (isEmailExists){
        res.status(400)
        return next(new Error("Email already in use"))
      }
      user.email = email
      isUpdated = true
    }

    // password update logic
    if (oldPassword || newPassword || confirmNewPassword){
      if (!oldPassword || !newPassword || !confirmNewPassword){
        res.status(400)
        return next(new Error("All password fields are required!"));
      }

      const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isOldPasswordMatch){
        res.status(400)
        return next(new Error("Old password is incorrect"))
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password)
      if (isSamePassword){
        res.status(400)
        return next(new Error("New password must be different from old password"))
      }

      if (newPassword !==confirmNewPassword){
        res.status(400)
        return next(new Error("Both passwords must be same"))
      }

      user.password = await bcrypt.hash(newPassword,10)
      isUpdated= true;
    }

    // No changes check
    if (!isUpdated){
      res.status(400)
      return next(new Error("No changes deteckted to update"))
    }

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


module.exports = { registerUser, loginUser, getUserDetails, editUserDetails };
