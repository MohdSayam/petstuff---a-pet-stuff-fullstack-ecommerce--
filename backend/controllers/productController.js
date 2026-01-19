const Product = require("../models/ProductSchema");
const Store = require("../models/StoreSchema");
const Order = require("../models/OrderSchema");
const mongoose = require("mongoose"); // Added for aggregation and ObjectId type casting
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary")

const sendError = (res, next, statusCode, message) => {
  res.status(statusCode);
  return next(new Error(message));
};

// Create product (admin only)
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
  } = req.body

  try {
    const store = await Store.findById(storeId);
    if (!store) return sendError(res, next, 404, "Store not found")

    if (store.owner.toString() !== req.user.id.toString()) {
      return sendError(res, next, 403, "Access forbidden: yoy don't own this store!")
    }

    // Validate images
    if (!req.files || req.files.length < 3) {
      return sendError(res, next, 400, "At least 3 images are required")
    }

    if (req.files.length > 5) {
      return sendError(res, next, 400, "Maximum 5 images allowed!")
    }

    // Upload to cloudinary
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer))

    const images = await Promise.all(uploadPromises)

    // Create product
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
      images
    });

    res.status(201).json(product)

  } catch (error) {
    console.error(error)
    return sendError(res, next, 400, error.message || "Product creation failed!")
  }
}

// Get product details (public)
const getProductDetailsToUser = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
      .populate({ path: "store", select: "name owner address createdAt" })
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

// Update product
const updateProductDetails = async (req, res, next) => {
  // req.product is guaranteed by the 'isStoreOwner' middleware
  const product = req.product;

  try {
    // Update text fields (exclude images)
    const { images, ...textData } = req.body;
    Object.assign(product, textData);

    // Handle new images
    if (req.files && req.files.length > 0) {
      const currentImageCount = product.images?.length || 0;
      const newImageCount = req.files.length;

      if (currentImageCount + newImageCount > 5) {
        return sendError(res, next, 400, `You have ${currentImageCount} images. You can only add ${5 - currentImageCount} more.`);
      }

      // Upload new images
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
      const newImages = await Promise.all(uploadPromises);

      // Add to existing images
      if (!product.images) product.images = [];
      product.images.push(...newImages);
    }

    // Save
    await product.save();
    res.status(200).json(product);

  } catch (error) {
    console.error(error);
    return sendError(res, next, 400, "Update failed");
  }
};

// delete product (Uses req.product from middleware)
const deleteProduct = async (req, res, next) => {
  const product = req.product;

  try {
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(image => {
        if (image.publicId) {
          return deleteFromCloudinary(image.publicId)
        }
      });

      await Promise.allSettled(deletePromises)
    }

    // delete from database
    await Product.findByIdAndDelete(product._id)

    res.status(200).json({
      message: "Product delete from database and cloudinary.",
      deleteId: product._id
    })
  } catch (error) {
    console.error(error)
    return sendError(res, next, 500, "Server error during deletion")
  }
}

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

    // Price filter
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

    // Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10; // we already initiate req.query so now i am using the varaibles directly
    const skip = (pageNumber - 1) * pageLimit; // It will throw me on 1st page or 0th index

    // Sorting
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

    // Fetch products
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

// Get store products (admin)
const getStoreProducts = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });

    if (!store) {
      return sendError(res, next, 404, "Store not found");
    }

    const storeId = store._id;
    const { productType, search, page, limit, sort, stockStatus, dateAfter } =
      req.query;

    // Filter by store
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

    // Date filter
    if (dateAfter) {
      try {
        filter.createdAt = { $gte: new Date(dateAfter) };
      } catch (e) {
        console.warn(`Invalid dateAfter format: ${dateAfter}`);
      }
    }

    // Pagination and sorting
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    let sortOption = {};
    // Admin sort options
    if (sort === "stockAsc") sortOption.stock = 1;
    else if (sort === "stockDesc") sortOption.stock = -1;
    else if (sort === "discount") sortOption.discountPercentage = -1;
    else sortOption.createdAt = -1;

    // Fetch products
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

    // Inventory stats
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

    // Sales stats
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
