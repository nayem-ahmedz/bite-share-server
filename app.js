const express = require('express');
const app = express();
const cors = require('cors');

// importing routes
const userRoutes = require('./routes/user');
const foodRoutes = require('./routes/food');

// Middleware
// CORS for normal requests
const corsOption = {
  origin: process.env.FRONTEND_LINK,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
};
app.use(cors(corsOption));
// method to get json body
app.use(express.json());

// default endpoint
app.get('/', (req, res) => {
  res.json({ status: true, message: 'Welcome to Bite Share server', corsOption});
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);

module.exports = app;