const express = require('express');
const app = express();
const cors = require('cors');

// importing routes
const userRoutes = require('./routes/user');
const foodRoutes = require('./routes/food');

// middleware
const corsOption = {
  origin: process.env.FRONTEND_LINK
}
app.use(cors(corsOption));
// method to get json body
app.use(express.json());

// default endpoint
app.get('/', (req, res) => {
  res.json({ status: true, message: process.env.FRONTEND_LINK });
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);

module.exports = app;