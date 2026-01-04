const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");

const protect = async (req, res, next) => {
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
      const user = await User.findById(decoded.user.id).select("-password");
      if (!user) {
        res.status(401);
        return next(new Error("Not authorized, user not found"));
      }

      //  Attach the full user object (including 'role') to the request for admin
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);

      if (error.name === "TokenExpiredError") {
        return next(new Error("Not authorized, token expired"));
      } else if (error.name === "JsonWebTokenError") {
        return next(new Error("Not authorized, invalid token"));
      }

      return next(new Error("Not authorized, token failed"));
    }
  } else {
    res.status(401);
    return next(new Error("There is no token , and not authorized"));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // if this condition true he is an admin so we can proceed
    next();
  } else {
    // 403 is used if you have token but not right role
    res.status(403);
    console.error("Not an admin check again ");
    return next(new Error("Not authorized"));
  }
};

const isStoreOwner = async (req, res, next) => {
  try {
    const productId = req.params.id;

    // 1. Fetch the product and populate the store owner ID
    const product = await Product.findById(productId).populate({
      path: "store",
      select: "owner",
    });

    if (!product) {
      res.status(404);
      return next(new Error(`Product with ID ${productId} not found.`));
    }

    // 2. CRITICAL CHECK: Verify ownership
    // Check if the store owner (via the product) matches the logged-in admin
    if (product.store.owner.toString() !== req.user.id.toString()) {
      res.status(403); // Forbidden
      return next(
        new Error("Access forbidden: You do not own this product's store.")
      );
    }

    // 3. Attach product to request for controller reuse
    req.product = product;
    next();
  } catch (error) {
    console.error(error);
    res.status(400);
    return next(
      new Error("Invalid product ID or database error during ownership check.")
    );
  }
};

module.exports = { protect, admin, isStoreOwner };
