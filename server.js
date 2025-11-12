const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require("firebase-admin");
const serviceAccount = require('./firebase-adminsdk.json');
const port = process.env.PORT || 3000;

// firebase admin sdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// middlewares
// cors setup
const allowedOrigins = [
  'http://localhost:5173'
]
app.use(cors({
  origin: allowedOrigins
}));
// method to get json body
app.use(express.json());
// verify firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.tokenEmail = userInfo.email;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
}

// test api
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// mongodb driver setup
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // db connection
    const db = client.db('bite_share');
    const users = db.collection('users');
    const foods = db.collection('foods');

    // users API
    app.post('/users', verifyFirebaseToken, async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email };
      if (req.body.email === req.tokenEmail) {
        const found = await users.findOne(query);
        if (!found) {
          const result = await users.insertOne(newUser);
          return res.status(201).send(result);
        }
        res.send({ message: 'user already exist!' });
      } else {
        res.status(403).send({ message: 'forbidden access' });
      }
    });

    // foods api
    // get all food
    app.get('/foods', async(req, res) => {
      const query = { foodStatus: 'Available' };
      const cursor = foods.find(query);
      const allValues = await cursor.toArray();
      res.send(allValues);
    });
    // get single food
    app.get('/foods/:id', async(req, res) => {
      const foodId = req.params.id;
      const query = { _id: new ObjectId(foodId) };
      const result = await foods.findOne(query);
      res.send(result);
    });
    // get featured food
    app.get('/featured-foods', async(req, res) => {
      const cursor = foods
        .find({ foodStatus: 'Available' })
        .sort({ foodQuantity: -1 })
        .limit(6);
      const featured = await cursor.toArray();
      res.send(featured);
    });
    // save a food
    app.post('/foods', verifyFirebaseToken, async(req, res) => {
      const newFood = req.body;
      if(req.body.email !== req.tokenEmail){
        return res.status(403).send({ message: 'forbidden access' });
      }
      const existing = await foods.findOne({
        email: newFood.email,
        foodName: newFood.foodName,
        pickupLocation: newFood.pickupLocation,
        foodQuantity: newFood.foodQuantity
      });
      if(existing){
        return res.status(409).json({ message: 'Food already added once!' });
      }
      const result = await foods.insertOne(newFood);
      res.status(201).send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`bite share server is running on port ${port}`);
});