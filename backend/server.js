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

app.get('/api/debug-env', (req, res) => {
  res.json({
    // We only check if it exists, don't show the real password!
    hasMongoUri: !!process.env.MONGO_URI, 
    mongoLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
    nodeEnv: process.env.NODE_ENV
  });
});
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
// Local Development
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
      console.error("Failed to connect to DB locally:", error);
    }
  };
  startServer();
};

// We add a middleware to ensure DB is connected before EVERY request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database Connection Failed in Middleware:", error);
        res.status(500).json({ error: "Database Connection Failed" });
    }
});
module.exports = app;
