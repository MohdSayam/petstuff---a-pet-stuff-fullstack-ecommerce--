const Order = require("../models/OrderSchema");
const Product = require("../models/ProductSchema");
const Store = require("../models/StoreSchema");
const mongoose = require("mongoose");

// error handler
const sendError = (res, next, statusCode, message) => {
  res.status(statusCode);
  return next(new Error(message));
};


// Create a new order
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } = req.body;
    const userId = req.user.id;

    if (!shippingInfo || !orderItems?.length || !itemsPrice || !shippingPrice || !totalPrice) {
      throw new Error("All fields are required");
    }

    // Process each item: Atomic check-and-update
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { 
          _id: item.product, 
          stock: { $gte: item.quantity } // ONLY update if stock is enough
        },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );

      if (!updatedProduct) {
        // This triggers the catch block, which aborts the transaction automatically
        throw new Error(`Insufficient stock or product not found: ${item.name}`);
      }
    }

    // Create the order
    const [order] = await Order.create([
      {
        shippingPrice,
        shippingInfo,
        orderItems,
        itemsPrice,
        totalPrice,
        user: userId,
      }
    ], { session });

    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order,
    });

  } catch (error) {
    // One place to handle all failures
    await session.abortTransaction();
    console.error("Transaction Aborted:", error.message);
    
    return res.status(error.message.includes("stock") ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
  

// get single order
const getSingleOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return sendError(
        res,
        next,
        404,
        `Order not found with the id ${orderId}`
      );
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return sendError(
        res,
        next,
        403,
        "You are not authorized to view this order"
      );
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    return sendError(res, next, 500, "Internal server error");
  }
};

// get logged in user orders
const myOrders = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const orders = await Order.find({ user: userId });
    if (!orders || orders.length === 0) {
      return sendError(res, next, 404, "You have no orders");
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    return sendError(res, next, 500, "Internal server error");
  }
};

// get all orders -- admin
const getAllOrders = async (req, res, next) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const totalOrdersCount = await Order.countDocuments({});

    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    if (!orders || orders.length === 0) {
      return sendError(res, next, 404, "No orders found");
    }

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalOrdersCount,
      page,
      limit,
      totalAmount,
      orders,
    });
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      next,
      500,
      "Internal server error while fetching all orders"
    );
  }
};

// get all orders -- store
const getStoreOrders = async (req, res, next) => {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);
  try {
    // find store associated with the owner
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
      return sendError(res, next, 404, "Store not found");
    }
    const storeId = store._id;

    const orders = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $match: { "productDetails.store": storeId } },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          shippingInfo: { $first: "$shippingInfo" },
          orderItems: { $push: "$orderItems" },
          itemsPrice: { $first: "$itemsPrice" },
          shippingPrice: { $first: "$shippingPrice" },
          totalPrice: { $first: "$totalPrice" },
          orderStatus: { $first: "$orderStatus" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (!orders || orders.length === 0) {
      return sendError(res, next, 404, "NO orders found for this store");
    }

    // calculate total amount
    let totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      totalAmount,
      orders,
    });
  } catch (error) {
    console.error("Store aggregation error", error);
    return sendError(
      res,
      next,
      500,
      "Internal server error while fetching store order details."
    );
  }
};

// updateOrderStatus -- admin
const updateOrderStatus = async (req, res, next) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return sendError(res, next, 404, `Order not found with id: ${orderId}`);
    }
    order.orderStatus = status;
    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `order ${orderId} status updated to ${status} successfully`,
      order,
    });
  } catch (error) {
    console.error("Error while updating order status", error);
    return sendError(
      res,
      next,
      500,
      "Internal server error while updating order status"
    );
  }
};

// delete order -- admin
const deleteOrder = async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return sendError(res, next, 404, `Order not found with id: ${orderId}`);
    }
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting order", error);
    return sendError(
      res,
      next,
      500,
      "Internal server error while deleting order"
    );
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
};
