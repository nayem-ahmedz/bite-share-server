const express = require('express');
const app = express();
const cors = require('cors');

// importing routes

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

// Routes
// app.use

// default endpoint
app.get('/', (req, res) => {
    res.json({status: true, message: 'Bite share server is running'});
});

module.exports = app;