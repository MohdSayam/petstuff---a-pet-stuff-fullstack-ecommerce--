const Product = require("../models/ProductSchema");
const Store = require("../models/StoreSchema");
const Order = require("../models/OrderSchema");
const mongoose = require("mongoose"); // Added for aggregation and ObjectId type casting

const sendError = (res, next, statusCode, message) => {
  res.status(statusCode);
  return next(new Error(message));
};

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
      return sendError(res, next, 404, "Store not found");
    }

    //  CRITICAL SECURITY CHECK: Verify store ownership
    // 'store.owner' holds the ObjectId of the admin user
    if (store.owner.toString() !== req.user.id.toString()) {
      return sendError(
        res,
        next,
        403,
        "Access forbidden:you do not own this store"
      );
    }

    if (!images || images.length < 3) {
      return sendError(
        res,
        next,
        400,
        "At least 3 images are required for a product"
      );
    }

    if (images.length > 5) {
      return sendError(
        res,
        next,
        400,
        "A maximum of 5 images are allowed per product"
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
    return sendError(
      res,
      next,
      400,
      error.message || "Could not create product due to validation error"
    );
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
      return sendError(res, next, 404, `Product with ${productId} not found`);
    }

    // Return the product details
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return sendError(res, next, 400, "Invalid product Id format");
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
    return sendError(res, next, 400, "Couldn't update the product details");
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
    return sendError(res, next, 400, "Couldn't delete the product");
  }
};

// get all products
const getAllProducts = async (req, res, next) => {
  try {
    let filter = {};
    const {
      animalType,
      productType,
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
    } = req.query;
    if (animalType) {
      filter.animalType = animalType;
    }
    if (productType) {
      filter.productType = productType;
    }

    // $gte = greater than equal to and $lte = less than equal to
    let priceFilter = {};
    if (minPrice) {
      priceFilter.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      priceFilter.$lte = parseFloat(maxPrice);
    }
    // Apply price filter only if $gte or $lte were set
    if (Object.keys(priceFilter).length > 0) {
      filter.salePrice = priceFilter;
    }

    // implementing search functionaliy
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // pagination setup
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10; // we already initiate req.query so now i am using the varaibles directly
    const skip = (pageNumber - 1) * pageLimit; // It will throw me on 1st page or 0th index

    // sorting functions:
    let sortOption = {};
    if (sort === "priceAsc") {
      sortOption.salePrice = 1;
    } else if (sort === "priceDesc") {
      sortOption.salePrice = -1;
    } else if (sort === "newest") {
      sortOption.createdAt = -1;
    } else if (sort === "oldest") {
      sortOption.createdAt = 1;
    } else if (sort === "discount") {
      sortOption.discountPercentage = -1;
    } else if (sort === "alphabetical") {
      sortOption.productName = 1;
    } else if (sort === "reverseAlphabetical") {
      sortOption.productName = -1;
    } else if (sort === "stockAsc") {
      sortOption.stock = 1;
    } else if (sort === "stockDesc") {
      sortOption.stock = -1;
    } else {
      sortOption.createdAt = -1;
    }

    // Fetch fo r pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / pageLimit);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort(sortOption)
      .populate({ path: "store", select: " name address" })
      .select(
        "-__v -createdAt -stock -originalPrice -discountPercentage -store.owner"
      );

    res.status(200).json({
      total,
      limit: pageLimit,
      page: pageNumber,
      totalPages,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return sendError(res, next, 500, "Couldn't fetch the products");
  }
};

// specific to that sotere producs
const getStoreProducts = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });

    if (!store) {
      return sendError(res, next, 404, "Store not found");
    }

    const storeId = store._id;
    const { productType, search, page, limit, sort, stockStatus, dateAfter } =
      req.query;

    // show only a particular store products
    let filter = { store: storeId };

    if (productType) {
      filter.productType = productType;
    }
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (stockStatus === "outOfStock") {
      filter.stock = 0;
    } else if (stockStatus === "inStock") {
      filter.stock = { $gt: 0 };
    } else if (stockStatus === "lowStock") {
      filter.stock = { $gt: 0, $lte: 5 };
    }

    // feature for filtering accodng to some kind of date
    if (dateAfter) {
      try {
        filter.createdAt = { $gte: new Date(dateAfter) };
      } catch (e) {
        console.warn(`Invalid dateAfter format: ${dateAfter}`);
      }
    }

    //  Pagination and Sorting like the getallproducts functionality
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    let sortOption = {};
    // Admin often needs to sort by inventory for management purposes
    if (sort === "stockAsc") sortOption.stock = 1;
    else if (sort === "stockDesc") sortOption.stock = -1;
    else if (sort === "discount") sortOption.discountPercentage = -1;
    else sortOption.createdAt = -1;

    // main logic for fetching the products
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / pageLimit);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort(sortOption)
      .populate({ path: "store", select: "name" });

    res.status(200).json({
      total,
      limit: pageLimit,
      page: pageNumber,
      totalPages,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return sendError(res, next, 500, "Couldn't fetch the store products");
  }
};

// analytics to store owner about products, orders and his store
const getStoreAnalytics = async (req, res, next) => {
  const ownerId = new mongoose.Types.ObjectId(req.user.id);
  try {
    const store = await Store.findOne({ owner: ownerId }).select("-id");
    if (!store) {
      return sendError(res, next, 404, "Store not found for this admin");
    }

    const storeId = store._id;

    // about inventory ( Product Aggregation)
    // i am using mongoDb aggregation pipelines here
    const stockSummary = await Product.aggregate([
      { $match: { store: storeId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          outOfStock: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
          lowStock: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", 5] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalStock: 1,
          outOfStock: 1,
          lowStock: 1,
        },
      },
    ]);

    // sales summary and monthly revenue (Order Aggregation)
    const salesData = await Order.aggregate([
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
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          monthlyRevenue: { $sum: "$orderItems.price" },
          orderIds: { $addToSet: "$_id" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$monthlyRevenue" },
          totalOrders: { $sum: { $size: "$orderIds" } },
          monthlyBreakdown: {
            $push: {
              year: "$_id.year",
              month: "$_id.month",
              revenue: "$monthlyRevenue",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          monthlyBreakdown: 1,
        },
      },
    ]);

    const finalSalesData = salesData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      monthlyBreakdown: [],
    };

    res.status(200).json({
      inventory: stockSummary[0] || {
        totalProducts: 0,
        totalStock: 0,
        outOfStock: 0,
        lowStock: 0,
      },
      sales: finalSalesData,
    });
  } catch (error) {
    console.error("Analytics Error", error);
    return sendError(res, next, 500, "Couldn't fetch the store analytics");
  }
};

module.exports = {
  createProduct,
  getProductDetailsToUser,
  getAdminProductDetails,
  updateProductDetails,
  deleteProduct,
  getAllProducts,
  getStoreProducts,
  getStoreAnalytics,
};
