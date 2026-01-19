const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("./config/passport"); // Google OAuth config

// Error handlers
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport for OAuth
app.use(passport.initialize());

// auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// product routes
app.use("/api/products", require("./routes/productRoutes"));

// store routes
app.use("/api/store", require("./routes/storeRoutes"));

// order routes
app.use("/api/orders", require("./routes/orderRoutes"));

// Error handlers
app.use(notFound);

app.use(errorHandler);

// Start server if run directly (Local Development)
if (require.main === module) {
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  };
  startServer();
} else {
  // For Vercel / Serverless to work we must connect to DB
  // Mongoose handles buffering so we can call this
  connectDB();
}

module.exports = app;
