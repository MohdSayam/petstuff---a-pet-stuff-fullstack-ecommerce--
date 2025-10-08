const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// error middlewares import
const {
  notFound,
  errorHandler,
} = require("../backend/middlewares/errorMiddleware");

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// For Routes
// authentication routes for register, login, get user details
app.use("/api/auth", require("./routes/authRoutes"));

// Global Error Handlers
// A. Not Found Handler (404)
// If a request reaches this line, it means it didn't match any route defined above.
app.use(notFound);

// B. General Error Handler (400, 500, etc.)
// This catches any error explicitly passed via next(error) from controllers or other middleware.
app.use(errorHandler);

// Server setup and port
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
