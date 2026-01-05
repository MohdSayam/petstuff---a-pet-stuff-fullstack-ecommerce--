const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// error middlewares import
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// first we have to make sure that we use dotenv.config() without this we can't use .env files
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// product routes
app.use("/api/products", require("./routes/productRoutes"));

// store routes
app.use("/api/store", require("./routes/storeRoutes"));

// order routes
app.use("/api/orders", require("./routes/orderRoutes"));

// Global Error Handlers
// A. Not Found Handler (404)
// If a request reaches this line, it means it didn't match any route defined above.
app.use(notFound);

// B. General Error Handler (400, 500, etc.)
// This catches any error explicitly passed via next(error) from controllers or other middleware.
app.use(errorHandler);

// Server setup and port
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();
