const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");

// importing related to store particularly
const {
  createStore,
  getStoreDetailsToCustomers,
  getStoreDetailsToOwner,
  updateStoreDetails,
  deleteStore,
} = require("../controllers/storeController");

// importing from products but we want to show it to store owner
const {
  getStoreProducts,
  getStoreAnalytics,
} = require("../controllers/productController");

// Routes for store owners (with authentication and authorization) we are using middlewares
router.post("/create", protect, admin, createStore);
router.get("/me", protect, admin, getStoreDetailsToOwner);
router.put("/me/update", protect, admin, updateStoreDetails);
router.delete("/me/delete", protect, admin, deleteStore);

// Routes from product controllers
router.get("/products", protect, admin, getStoreProducts);
router.get("/analytics", protect, admin, getStoreAnalytics);

// Public routes
router.get("/public/:id", getStoreDetailsToCustomers);

module.exports = router;
