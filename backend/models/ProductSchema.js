const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Name of the product (e.g., 'Pro-Plan Puppy Chow')
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    // Long description
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    // Original price (MSRP or "before price")
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: 0,
    },
    // Sale price (The discounted price, or current "after price")
    salePrice: {
      type: Number,
      min: 0,
    },
    // Calculated discount percentage
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Inventory count
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: 0,
      default: 0,
    },
    // NEW: Category based on animal type (e.g., 'Dog', 'Cat', 'Bird')
    animalType: {
      type: String,
      required: [true, "Animal type is required"],
      enum: ["Dog", "Cat", "Bird", "Other"],
    },
    // UPDATED: Category based on product function (e.g., 'Food', 'Medicine', 'Toys')
    productType: {
      type: String,
      required: [true, "Product type is required"],
      enum: ["Food", "Medicines", "Toys", "Accessories", "Grooming", "Snacks"],
    },
    // Store that sells this product (One-to-one link to Store)
    store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
      required: true,
    },
    // Placeholder for product images (an array of strings or objects)
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
); // Enable virtuals/middleware

// Middleware to automatically calculate salePrice or discountPercentage before saving
productSchema.pre("save", function (next) {
  // If salePrice is not explicitly set, assume it's the original price (no sale)
  if (!this.salePrice) {
    this.salePrice = this.originalPrice;
    this.discountPercentage = 0;
  }

  // Ensure sale price is never higher than the original price
  if (this.salePrice > this.originalPrice) {
    this.salePrice = this.originalPrice;
  }

  // Calculate the discount percentage
  if (this.originalPrice > 0 && this.originalPrice > this.salePrice) {
    const discount = this.originalPrice - this.salePrice;
    this.discountPercentage = Math.round((discount / this.originalPrice) * 100);
  } else {
    this.discountPercentage = 0;
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
