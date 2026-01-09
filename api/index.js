// api/index.js
const app = require("../app");
const connectDB = require("../config/connectDB");

// Serverless function wrapper
module.exports = async (req, res) => {
  try {
    await connectDB(); // safe to call on every request
    return app(req, res); // delegate to Express app
  } catch (err) {
    console.error("DB connection error:", err.message);
    res.status(500).json({ status: false, message: "Database connection failed" });
  }
};