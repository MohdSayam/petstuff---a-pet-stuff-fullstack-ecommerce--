const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const Store = require("../models/StoreSchema");

// check if user role is admin than he can create product in his own store
const createProduct = async (req, res, next) => {
  const {
    productName,
    description,
    originalPrice,
    salePrice,
    discountPercentage,
    stock,
    animalType,
    productType,
    store: storeId,
    images,
  } = req.body;
  try {
    // check if store belongs to the user(admin)
    const store = await Store.findById(storeId);
    if (!store) {
      res.status(404);
      return next(new Error("Store not found"));
    }

    //  CRITICAL SECURITY CHECK: Verify store ownership
    // 'store.owner' holds the ObjectId of the admin user
    if (store.owner.toString() !== req.user.id.toString()) {
      res.status(403); // Forbidden
      return next(
        new Error("You are not authorized to add products to this store.")
      );
    }

    const product = await Product.create({
      productName,
      description,
      originalPrice,
      salePrice,
      discountPercentage,
      stock,
      animalType,
      productType,
      store: storeId,
      images,
    });

    // response to the frontend
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400);
    return next(error);
  }
};

// read the product means get the product info for the user to see the product details
const getProductDetailsToUser = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
      .populate({ path: "store", select: "name owner address" })
      .select("-__v -createdAt");
    if (!product) {
      res.status(404);
      return next(new Error(`Product with ID ${req.params.id} not found.`));
    }

    // Return the product details
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400);
    return next(new Error("Invalid product Id format"));
  }
};

// get product details for the admin who created the product
const getAdminProductDetails = async (req, res) => {
  const adminProductData = req.product.toObject();
  delete adminProductData.store.owner;
  res.status(200).json(adminProductData);
};

// update product details (Uses req.product from middleware)
const updateProductDetails = async (req, res, next) => {
  // If we reach here, req.product is guaranteed to exist and be owned by the user.
  const product = req.product;

  try {
    const updatedData = req.body;

    // Efficiently merge new data into the Mongoose document
    Object.assign(product, updatedData);
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400);
    return next(new Error("Couldn't update the product details"));
  }
};

// delete product (Uses req.product from middleware)
const deleteProduct = async (req, res, next) => {
  // If we reach here, req.product is guaranteed to exist and be owned by the user.
  const productId = req.product._id;

  try {
    // Use the ID to delete the document
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // Confirmation response
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400);
    return next(new Error("Couldn't delete the product"));
  }
};

// get all products (filtering by animal type or prduct type or both)
const getAllProducts = async (req, res, next) => {};

module.exports = {
  createProduct,
  getProductDetailsToUser,
  getAdminProductDetails,
  updateProductDetails,
  deleteProduct,
};
