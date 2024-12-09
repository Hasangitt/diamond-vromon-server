const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://diamond-vromon.web.app',
    'https://diamond-vromon.firebaseapp.com'
  ],
  credentials: true
}));
app.use(express.json());

// const cookieOption = {
//   httpOnly: true,
//   sameSite: process.env.NODE_ENV === "production"? "none" : "strict",
//   secure: process.env.NODE_ENV === "production" ? true : false
// }

// console.log(cookieOption)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdldp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotsCollection = client.db("spotsDB").collection("spots");

    app.post("/spots", async(req, res) => {
      const spot = req.body;
      const result = await spotsCollection.insertOne(spot);
      res.send(result)
    });

    app.get("/spots", async(req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.delete("/spots/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotsCollection.deleteOne(query);
      res.send(result);
    });
    
    app.get("/spots/:id", async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotsCollection.findOne(query);
      res.send(result)
    })

    app.put("/spots/:id", async(req, res) => {
      const spot = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateSpot ={
        $set: {
          email: spot.email,
          name: spot.name,
          spotName: spot.spotName,
          countryName: spot.countryName,
          location: spot.location,
          description: spot.description,
          cost: spot.cost,
          seasonality: spot.seasonality,
          travel: spot.travel,
          visitors: spot.visitors,
          photo: spot.photo
        }
      };
      const result = await spotsCollection.updateOne(filter, updateSpot, options)
      res.send(result)
    });


    app.get('/spots/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email: new ObjectId (email)};
      const cursor = spotsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


app.get("/", (req, res) => {
    res.send('This is Diamond Vromon Tourism Service Server')
});

app.listen(port, (req, res) => {
    console.log(`Diamond Vromon Project Server Running On ${port}`)
})