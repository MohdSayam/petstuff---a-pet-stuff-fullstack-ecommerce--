const express = require("express");
const router = express.Router();
const {
  protect,
  admin,
  isStoreOwner,
} = require("../middlewares/authMiddleware");

const {
  createProduct,
  getProductDetailsToUser,
  getAdminProductDetails,
  updateProductDetails,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");

// public routes no auth needs
router.get("/", getAllProducts);
router.get("/:id", getProductDetailsToUser);

// routes using middlewares
router.post("/create", protect, admin, createProduct);
router.get("/admin/:id", protect, admin, isStoreOwner, getAdminProductDetails);
router.put("/admin/:id", protect, admin, isStoreOwner, updateProductDetails);
router.delete("/admin/:id", protect, admin, isStoreOwner, deleteProduct);

module.exports = router;
