const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();
connectDB();
console.log(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

// For Routes
// authentication routes for register, login, get user details
app.use("/api/auth", require("./routes/authRoutes"));

// Server setup and port
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
