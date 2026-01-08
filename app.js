const express = require('express');
const app = express();
const cors = require('cors');

// importing routes
const userRoutes = require('./routes/user');
const foodRoutes = require('./routes/food');

// middlewares
// cors setup
const allowedOrigins = [
  process.env.FRONTEND_LINK
]
app.use(cors({
  origin: allowedOrigins
}));

// method to get json body
app.use(express.json());

// default endpoint
app.get('/', (req, res) => {
  res.json({status: true, message: 'Bite share server is running smoothly'});
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);

module.exports = app;