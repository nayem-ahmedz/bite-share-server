const mongoose = require("mongoose");

// Use a global cache so the connection survives across hot reloads and serverless warm starts
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  // Reuse existing connection if available
  if (cached.conn) return cached.conn;

  // Create a single connection promise to prevent multiple concurrent connection attempts
  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // fail fast if not connected
    });
  }

  try {
    // Await the shared connection promise
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset the promise on failure so future calls can retry
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};

module.exports = connectDB;