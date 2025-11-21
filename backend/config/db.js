const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.error("Error connecting to MONGO DB", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
