const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // Link to the user who placed the order (Many-to-one relationship)
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  // Array of items purchased
  orderItems: [
    {
      // The name of the product at the time of purchase
      name: { type: String, required: true },
      // The price of the product at the time of purchase
      price: { type: Number, required: true },
      // The quantity ordered
      quantity: { type: Number, required: true },
      // The product ID (for reference, but not used for price/name later)
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  // Shipping information
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  // Total cost of all items in the order
  itemsPrice: {
    type: Number,
    default: 0.0,
    required: true,
  },
  // Shipping cost
  shippingPrice: {
    type: Number,
    default: 0.0,
    required: true,
  },
  // Grand total (itemsPrice + shippingPrice)
  totalPrice: {
    type: Number,
    default: 0.0,
    required: true,
  },
  // Status of the order (e.g., 'Processing', 'Shipped', 'Delivered')
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  // When the order was delivered (optional)
  deliveredAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
