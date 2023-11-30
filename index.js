const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//====================
//Mongo DB
//====================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojansry.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const usersCollection = client.db("fluffyFriends").collection("users");
    const slidesCollection = client.db("fluffyFriends").collection("slides");
    const categoriesCollection = client
      .db("fluffyFriends")
      .collection("categories");
    const reviewsCollection = client.db("fluffyFriends").collection("reviews");
    const petsCollection = client.db("fluffyFriends").collection("pets");
    const donationsCollection = client
      .db("fluffyFriends")
      .collection("donations");
    const adoptionsCollection = client
      .db("fluffyFriends")
      .collection("adoption-requests");

    //users
    app.post("/users", async (req, res) => {
      const userInfo = req.body;
      //check if the user is already exists
      const userEmail = userInfo.email;
      const query = { email: userEmail };
      const isExists = await usersCollection.findOne(query);
      if (isExists) {
        return res.send("User already in the Database");
      } else {
        const result = await usersCollection.insertOne(userInfo);
        res.send(result);
      }
    });
    //=====================
    // User Dashboard API
    //=====================
    app.post("/add-pet",async(req,res)=>{
      const request = req.body;
      const result = await petsCollection.insertOne(request);
      res.send(result);
    })
    // slides
    app.get("/slides", async (req, res) => {
      const result = await slidesCollection.find().toArray();
      res.send(result);
    });
    //categories
    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });
    //reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    //pets
    app.get("/pets", async (req, res) => {
      const result = await petsCollection.find().toArray();
      res.send(result);
    });
    //pet details
    app.get("/pet/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    });
    //Pet Adoption Requests
    app.post("/adoption-requests", async (req, res) => {
      const request = req.body;
      const result = await adoptionsCollection.insertOne(request);
      res.send(result);
    });
    //pet category
    app.get(`/pet/category/:id`, async (req, res) => {
      const category = req.params.id;
      const query = { category: category };
      const result = await petsCollection.find(query).toArray();
      res.send(result);
    });

    //donations
    app.get("/donations", async (req, res) => {
      const result = await donationsCollection.find().toArray();
      res.send(result);
    });
    //donation details
    app.get("/donation/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationsCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

//Express
app.get("/", (req, res) => {
  res.send("Fluffy Friends Server is running");
});
app.listen(port, () => {
  console.log(`Fluffy Friend Server is running on port on ${port}`);
});
