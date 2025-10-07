const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

const protect = (req, res, next) => {
  // get token from the header and then check jwt
  let token;
  const authHeader = req.header("Authorization");

  // check if authorization header exists and starts with bearer
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // token with remove bearer and space so we can compare without bearer
      token = authHeader.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetch user detailsfrom token
      const user = User.findById(decoded.user.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found or token invalid" });
      }

      //  Attach the full user object (including 'role') to the request for admin
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "There is no token, not authorized" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // if this condition true he is an admin so we can proceed
    next();
  } else {
    res.status(401);
    console.error("Not an admin check again ");
    throw new Error("Not authorized as an admin");
  }
};

module.exports = { protect, admin };
