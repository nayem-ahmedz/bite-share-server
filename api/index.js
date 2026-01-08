// api/index.js
const app = require("../app");
const connectDB = require("../config/connectDB");

const allowedOrigin = process.env.FRONTEND_LINK;

// Serverless function wrapper
module.exports = async (req, res) => {
  // Handle preflight requests (OPTIONS) first
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }
  try {
    await connectDB(); // safe to call on every request
    return app(req, res); // delegate to Express app
  } catch (err) {
    console.error("DB connection error:", err.message);
    res.status(500).json({ message: "Database connection failed" });
  }
};