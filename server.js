const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;

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

    // users API
    app.post('/users', async(req, res) => {
        const newUser = req.body;
        const query = {email: newUser.email};
        const found = await users.findOne(query);
        if(!found){
            const result = await users.insertOne(newUser);
            return res.send(result);
        }
        res.send({message: 'user already exist!'});
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