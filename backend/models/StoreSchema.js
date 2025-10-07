const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  // Store name (must be unique)
  name: {
    type: String,
    required: [true, "Store name is required"],
    unique: true,
    trim: true,
  },
  // Short description of the store/brand
  description: {
    type: String,
    required: [true, "Store description is required"],
  },
  // Reference to the user who owns/manages this store (One-to-one relationship)
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  // Store contact email
  email: {
    type: String,
    lowercase: true,
  },
  // Store's physical location or main service area
  location: String,

  // Products belonging to this store. This will be dynamically populated (virtuals are better here)
  // For simplicity, we just establish the link via the Product model's store field.

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Store", storeSchema);
