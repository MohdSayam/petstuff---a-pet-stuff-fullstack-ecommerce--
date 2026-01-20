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

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport for OAuth
app.use(passport.initialize());

// CRITICAL: DB connection middleware MUST come BEFORE routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Connection Failed in Middleware:", error);
    res.status(500).json({ error: "Database Connection Failed" });
  }
});

// Health check endpoint (useful for deployment verification)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// product routes
app.use("/api/products", require("./routes/productRoutes"));

// store routes
app.use("/api/store", require("./routes/storeRoutes"));

// order routes
app.use("/api/orders", require("./routes/orderRoutes"));

// Error handlers (must be AFTER routes)
app.use(notFound);
app.use(errorHandler);

// Start server if run directly (Local Development)
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
      console.error("Failed to connect to DB locally:", error);
      process.exit(1);
    }
  };
  startServer();
}

module.exports = app;
