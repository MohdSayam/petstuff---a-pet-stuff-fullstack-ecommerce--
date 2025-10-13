const Product = require("../models/ProductSchema");
const Store = require("../models/StoreSchema");
const mongoose = require("mongoose");

// Utility to enforce setting statusCode before calling next(error)
const sendError = (res, next, statusCode, message) => {
  res.status(statusCode);
  return next(new Error(message));
};

// create a new store
const createStore = async (req, res, next) => {
  const { name, description, email, location } = req.body;
  const owner = req.user.id;
  try {
    if (!name || !description) {
      return sendError(
        res,
        next,
        400,
        "Store name and description are required"
      );
    }

    const existingStore = await Store.findOne({ owner });
    if (existingStore) {
      return sendError(
        res,
        next,
        400,
        "You already have a store you can't create another"
      );
    }

    const store = await Store.create({
      name,
      description,
      email,
      location,
      owner,
    });

    res.status(201).json({
      message: "Store created successfully",
      store: store,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A store with this name already exists." });
    }
    console.error("Error creating store:", error);
    return sendError(res, next, 500, "Server error while creating store");
  }
};

const getStoreDetailsToOwner = async (req, res, next) => {
  const owner = req.user.id;
  try {
    const store = await Store.findOne({ owner }).populate({
      path: "owner",
      select: "name email -_id", // Correctly populating and selecting owner details
    });

    if (!store) {
      return sendError(res, next, 404, "Store not found for this owner");
    }

    res.status(200).json({ store });
  } catch (error) {
    console.error("Error fetching store details:", error);
    return sendError(
      res,
      next,
      500,
      "Server error while fetching store details"
    );
  }
};

const getStoreDetailsToCustomers = async (req, res, next) => {
  const storeId = req.params.id;

  try {
    const store = await Store.findById(storeId).select(
      "name description location createdAt"
    );
    if (!store) {
      return sendError(res, next, 404, "Store not found");
    }

    res.status(200).json({ store });
  } catch (error) {
    console.error(error);
    // Added specific check for invalid ID format (CastError)
    if (error instanceof mongoose.Error.CastError) {
      return sendError(res, next, 400, "Invalid Store ID format");
    }
    return sendError(
      res,
      next,
      500,
      "Server error while fetching store details"
    );
  }
};

const updateStoreDetails = async (req, res, next) => {
  const owner = req.user.id;
  const { name, description, email, location } = req.body;
  try {
    const store = await Store.findOne({ owner });
    if (!store) {
      return sendError(res, next, 404, "Store not found for this owner ");
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (email) updatedData.email = email;
    if (location) updatedData.location = location;

    const updatedStore = await Store.findByIdAndUpdate(store._id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Store details updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A store with this name already exists." });
    }
    console.error(error);
    return sendError(
      res,
      next,
      500,
      "Server error while updating store details"
    );
  }
};

const deleteStore = async (req, res, next) => {
  const owner = req.user.id;
  try {
    const store = await Store.findOne({ owner });
    if (!store) {
      return sendError(res, next, 404, "Store not found for this owner");
    }

    // Delete all products associated with this store and this store also
    await Product.deleteMany({ store: store._id });
    await Store.findByIdAndDelete(store._id);
    res
      .status(200)
      .json({ message: "Store and its related products completely vanished" });
  } catch (error) {
    console.error(error);
    return sendError(res, next, 500, "Server error while deleting store");
  }
};

module.exports = {
  createStore,
  getStoreDetailsToOwner,
  updateStoreDetails,
  getStoreDetailsToCustomers,
  deleteStore,
};
