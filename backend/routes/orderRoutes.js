const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");

const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  getStoreOrders,
  myOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// customer routes protected by "protect"
router.post("/create", protect, createOrder); // only authenticated users create orders
router.get("/me", protect, myOrders); // logged in users all orders
router.get("/:id", protect, getSingleOrder); // single order details here

// admin(store owner routes)
router.get("/admin/all", protect, admin, getAllOrders);
router.get("/admin/store", protect, admin, getStoreOrders);
router.put("/admin/:id/status", protect, admin, updateOrderStatus);
router.delete("/admin/:id", protect, admin, deleteOrder);

module.exports = router;
