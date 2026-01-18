const Order = require("../models/OrderSchema");
const Product = require("../models/ProductSchema");
const Store = require("../models/StoreSchema");
const mongoose = require("mongoose");

// Helper
const sendError = (res, next, statusCode, message) => {
  res.status(statusCode);
  return next(new Error(message));
};

// 1. CREATE ORDER
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } = req.body;
    const userId = req.user.id;

    if (!shippingInfo || !orderItems?.length || itemsPrice === undefined || shippingPrice===undefined || totalPrice === undefined) {
      throw new Error("All fields are required");
    }

    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
      if (!updatedProduct) throw new Error(`Insufficient stock for: ${item.name}`);
    }

    const [order] = await Order.create([{
        shippingPrice, shippingInfo, orderItems, itemsPrice, totalPrice, user: userId,
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, message: "Order Created Successfully", order });
  } catch (error) {
    await session.abortTransaction();
    return res.status(error.message.includes("stock") ? 400 : 500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// 2. GET SINGLE ORDER
const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'images name');
    if (!order) return sendError(res, next, 404, "Order not found");

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return sendError(res, next, 403, "Not authorized");
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    return sendError(res, next, 500, "Server Error");
  }
};

// 3. MY ORDERS (Pagination)
const myOrders = async (req, res, next) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalOrders = await Order.countDocuments({ user: userId });
    const orders = await Order.find({ user: userId })
      .populate({ path : 'orderItems.product', select: 'images name' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true, orders, totalOrders,
      totalPages: Math.ceil(totalOrders / limit), currentPage: page
    });
  } catch (error) {
    return sendError(res, next, 500, "Server Error");
  }
};

// 4. ADMIN: GET ALL ORDERS
const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status && status !== 'All') query.orderStatus = status;

    const totalOrdersCount = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate({ path: 'orderItems.product', select: 'images name' });

    res.status(200).json({
      success: true, orders, totalOrdersCount,
      totalPages: Math.ceil(totalOrdersCount / limit), currentPage: page
    });
  } catch (error) {
    return sendError(res, next, 500, "Server Error");
  }
};

// 5. GET STORE ORDERS (Secure, Paginated, Filtered)
const getStoreOrders = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // A. Find the Store belonging to this Admin
    const store = await Store.findOne({ owner: ownerId });
    if (!store) return sendError(res, next, 404, "You do not have a store created yet.");

    // B. Find all Products belonging to this Store
    // We only want orders that contain THESE products
    const storeProducts = await Product.find({ store: store._id }).select('_id');
    const storeProductIds = storeProducts.map(p => p._id);

    // C. Build the Order Query
    // Logic: Find orders where 'orderItems.product' is IN our list of store products
    let query = {
      'orderItems.product': { $in: storeProductIds }
    };

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    // D. Count & Fetch
    const totalOrdersCount = await Order.countDocuments(query);
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate({ path: 'orderItems.product', select: 'images name' });

    // Calculate Revenue only for THIS store's orders
    // (Note: In a real complex marketplace, you'd calculate revenue only for your specific line items, 
    // but for now, we sum the order totals visible to you)
    const allMatchingOrders = await Order.find(query).select('totalPrice');
    const totalAmount = allMatchingOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);

    res.status(200).json({
      success: true,
      totalOrdersCount,
      totalPages: Math.ceil(totalOrdersCount / limit),
      currentPage: page,
      totalAmount,
      orders,
    });

  } catch (error) {
    console.error("Get Store Orders Error:", error);
    return sendError(res, next, 500, "Server Error");
  }
};

// 6. SECURE UPDATE STATUS
const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const ownerId = req.user._id;

    // A. Find the Store
    const store = await Store.findOne({ owner: ownerId });
    if (!store) return sendError(res, next, 403, "Unauthorized Action");

    // B. Find the Order
    const order = await Order.findById(orderId).populate('orderItems.product');
    if (!order) return sendError(res, next, 404, "Order not found");

    // C. SECURITY CHECK: Does this order contain MY products?
    // If the order has no products belonging to my store, I cannot touch it.
    const hasMyProduct = order.orderItems.some(item => 
      item.product && item.product.store.toString() === store._id.toString()
    );

    if (!hasMyProduct) {
      return sendError(res, next, 403, "You cannot manage orders that do not belong to your store.");
    }

    // D. Proceed with Update
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") order.deliveredAt = Date.now();
    
    await order.save();
    res.status(200).json({ success: true, message: `Status updated to ${req.body.status}` });

  } catch (error) {
    return sendError(res, next, 500, "Update failed");
  }
};

// 7. SECURE DELETE ORDER
const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const ownerId = req.user._id;

    const store = await Store.findOne({ owner: ownerId });
    const order = await Order.findById(orderId).populate('orderItems.product');

    if (!order) return sendError(res, next, 404, "Order not found");

    // SECURITY CHECK
    const hasMyProduct = order.orderItems.some(item => 
      item.product && item.product.store.toString() === store._id.toString()
    );

    if (!hasMyProduct) {
      return sendError(res, next, 403, "You cannot delete orders that do not belong to your store.");
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ success: true, message: "Order deleted" });

  } catch (error) {
    return sendError(res, next, 500, "Delete failed");
  }
};
// 8. CANCEL ORDER (User)
const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return sendError(res, next, 404, "Order not found");

    if (['Shipped', 'Delivered'].includes(order.orderStatus)) {
      return sendError(res, next, 400, "Cannot cancel shipped orders");
    }
    order.orderStatus = "Cancelled";
    await order.save();
    res.status(200).json({ success: true, message: "Order Cancelled", order });
  } catch (error) {
    return sendError(res, next, 500, "Cancel failed");
  }
};

module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  getStoreOrders, 
  updateOrderStatus,
  deleteOrder,
  cancelMyOrder
};