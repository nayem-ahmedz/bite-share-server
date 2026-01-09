require('dotenv').config()
const app = require('./app');
const connectDB = require('./config/connectDB');

const port = process.env.PORT || 3000;

const startServer = async() => {
  try{
    await connectDB();
    app.listen(port, () => {
      console.log('Bite share server is running on port', port);
    })
  } catch(err){
    console.error("Failed to start server:", err.message);
  }
}

// startServer();