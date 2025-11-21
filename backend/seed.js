const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// --- 1. REQUIRE MODELS ---
// NOTE: Adjust paths below if your models are not in the current directory's 'models' folder
const User = require("./models/UserSchema");
const Product = require("./models/ProductSchema");
const Store = require("./models/StoreSchema");
const Order = require("./models/OrderSchema");

// --- 2. CONFIGURATION ---
const DUMMY_PASSWORD = "password123";
const NUM_PRODUCTS = 150;
const NUM_ORDERS = 50;

const animalTypes = ["Dog", "Cat", "Bird", "Other"];
const productTypes = [
  "Food",
  "Medicines",
  "Toys",
  "Accessories",
  "Grooming",
  "Snacks",
];
const orderStatuses = ["Processing", "Shipped", "Delivered"];

const DUMMY_IMAGE_URL = (id) =>
  `https://placehold.co/150x150/007bff/FFFFFF?text=Prod${id}`;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Ensure MONGO_URI is set in your .env
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// --- 3. HELPER FUNCTIONS ---

// Function to generate random dummy images
const generateImages = (id) => {
  const images = [];
  for (let i = 1; i <= 3; i++) {
    // Ensure minimum of 3 images
    images.push({
      url: DUMMY_IMAGE_URL(id) + `_v${i}`,
      public_id: `prod_test_${id}_v${i}`,
    });
  }
  return images;
};

// Function to generate random order item array
const generateOrderItems = (allProducts) => {
  const items = [];
  const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per order
  let itemsPrice = 0;

  for (let i = 0; i < numItems; i++) {
    const product = allProducts[Math.floor(Math.random() * allProducts.length)];
    const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 quantity

    items.push({
      name: product.productName,
      price: product.salePrice, // Use salePrice for order
      quantity: quantity,
      product: product._id,
    });
    itemsPrice += product.salePrice * quantity;
  }
  return { items, itemsPrice };
};

// --- 4. MAIN IMPORT FUNCTION ---
const importData = async () => {
  try {
    // --- CLEANUP ---
    await User.deleteMany();
    await Store.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Database cleared successfully.");

    // --- A. CREATE USERS ---
    const hashedPassword = await bcrypt.hash(DUMMY_PASSWORD, 10);
    const usersData = [];

    // 2 Admin Users (Store Owners)
    for (let i = 1; i <= 2; i++) {
      usersData.push({
        name: `AdminUser${i}`,
        email: `admin${i}@example.com`,
        password: hashedPassword,
        role: "admin",
      });
    }

    // 10 Customer Users
    for (let i = 1; i <= 10; i++) {
      usersData.push({
        name: `Customer${i}`,
        email: `customer${i}@example.com`,
        password: hashedPassword,
        role: "customer",
      });
    }
    const createdUsers = await User.insertMany(usersData);
    const admins = createdUsers.slice(0, 2);
    const customers = createdUsers.slice(2);
    console.log(
      `Created ${createdUsers.length} Users (2 Admins, 10 Customers).`
    );

    // --- B. CREATE STORES ---
    const storesData = admins.map((admin, index) => ({
      name: `Store of Admin ${index + 1}`,
      description: `A unique pet store owned by AdminUser${index + 1}.`,
      owner: admin._id,
      email: `store${index + 1}@shop.com`,
      location: `City ${index + 1}`,
    }));
    const createdStores = await Store.insertMany(storesData);
    console.log(`Created ${createdStores.length} Stores.`);

    // --- C. CREATE PRODUCTS (150+ Products) ---
    const productsData = [];
    for (let i = 1; i <= NUM_PRODUCTS; i++) {
      const originalPrice = Math.floor(Math.random() * 90) + 10; // $10 to $100
      const salePrice =
        originalPrice - Math.floor(Math.random() * (originalPrice / 3)); // Up to 33% off
      const stock = i % 15 === 0 ? 0 : Math.floor(Math.random() * 50) + 1; // Create some out-of-stock items

      productsData.push({
        productName: `Product Sample ${i} - ${
          animalTypes[i % animalTypes.length]
        } ${productTypes[i % productTypes.length]}`,
        description: `Description for Product ${i}. Great for ${
          animalTypes[i % animalTypes.length]
        }.`,
        originalPrice: originalPrice,
        salePrice: salePrice,
        stock: stock,
        animalType: animalTypes[i % animalTypes.length],
        productType: productTypes[i % productTypes.length],
        store: createdStores[i % createdStores.length]._id, // Distribute products across stores
        images: generateImages(i),
      });
    }
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} Products.`);

    // --- D. CREATE ORDERS (50 Orders) ---
    const ordersData = [];
    const shippingPrice = 5.0;
    for (let i = 0; i < NUM_ORDERS; i++) {
      const customer = customers[i % customers.length];
      const { items, itemsPrice } = generateOrderItems(createdProducts);
      const totalPrice = itemsPrice + shippingPrice;

      ordersData.push({
        user: customer._id,
        orderItems: items,
        shippingInfo: {
          address: `123 Main St, Apt ${i + 1}`,
          city: `City ${i % 5}`,
          postalCode: `1234${i % 10}`,
          country: "USA",
        },
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
        orderStatus: orderStatuses[i % orderStatuses.length],
      });
    }
    await Order.insertMany(ordersData);
    console.log(`Created ${NUM_ORDERS} Orders.`);

    console.log("\n--- ✅ ALL DATA IMPORTED SUCCESSFULLY ---\n");
    console.log(
      `🔑 Login Email for Admins: admin1@example.com, admin2@example.com`
    );
    console.log(`🔑 Login Password for ALL Users: ${DUMMY_PASSWORD}`);
    console.log(`💾 Store ID for Admin 1: ${admins[0]._id}`);
    console.log(`💾 Store ID for Admin 2: ${admins[1]._id}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error Importing Data:", error);
    process.exit(1);
  }
};

connectDB().then(() => {
  importData();
});
