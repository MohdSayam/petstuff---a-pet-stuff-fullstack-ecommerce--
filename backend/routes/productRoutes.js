const express = require("express");
const router = express.Router();
const {
  protect,
  admin,
  isStoreOwner,
} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware")

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
router.post("/create", protect, admin, upload.array("images", 5), createProduct);
router.get("/admin/:id", protect, admin, isStoreOwner, getAdminProductDetails);
router.put("/update/:id", protect, admin, upload.array("images", 5), isStoreOwner, updateProductDetails);
router.delete("/delete/:id", protect, admin, isStoreOwner, deleteProduct);

module.exports = router;
