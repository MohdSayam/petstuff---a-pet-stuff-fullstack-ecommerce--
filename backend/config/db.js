const mongoose = require('mongoose');

// Define global cache to prevent multiple connections in Serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. If already connected, reuse the connection
  if (cached.conn) {
    console.log(" Using cached MongoDB connection");
    return cached.conn;
  }

  // 2. If no connection exists, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Important for Serverless
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(" New MongoDB connection established");
      return mongoose;
    });
  }

  // 3. Await the promise
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(" MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;