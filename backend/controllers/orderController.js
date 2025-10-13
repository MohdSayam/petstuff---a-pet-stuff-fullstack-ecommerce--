const Order = require("../models/OrderSchema");
const Product = require("../models/ProductSchema");

// error handler
const sendError = (res, next, statusCode, message) => {
  res.status(statusCode);
  return next(new Error(message));
};

// this is a helper function
const updateStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  product.stock -= quantity; // product update ho jayga if order create ho gya to
  await product.save({ validateBeforeSave: false });
};

// Create a new order
const createOrder = async (req, res, next) => {
  const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } =
    req.body;

  const userId = req.user._id;
  try {
    if (
      !shippingInfo ||
      !orderItems ||
      orderItems.length === 0 ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice
    ) {
      return sendError(res, next, 400, "All fields are required");
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product).select("stock");
      if (!product) {
        return sendError(
          res,
          next,
          404,
          `Product not found with id ${item.product}`
        );
      }
      if (product.stock < item.quantity) {
        return sendError(
          res,
          next,
          400,
          `Only ${product.stock} items left in stock for product: ${item.name}`
        );
      }
      await updateStock(item.product, item.quantity);
    }

    const order = await Order.create({
      shippingPrice,
      itemsPrice,
      totalPrice,
      shippingInfo,
      orderItems,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Order created and stock updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in creating order", error);
    return sendError(res, next, 500, "Internal Server Error");
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
const getAllOrders = async (req, res, next) => {};

// get all orders -- store
const getStoreOrders = async (req, res, next) => {};

// updateOrderStatus -- admin
const updateOrderStatus = async (req, res, next) => {};

// delete order -- admin
const deleteOrder = async (req, res, next) => {};

module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  getStoreOrders,
  updateOrderStatus,
  deleteOrder,
};
