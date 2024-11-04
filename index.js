const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middlewares
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@foodie-cluster.e2b4b.mongodb.net/?retryWrites=true&w=majority&appName=foodie-cluster`;

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
    await client.connect();


    const hotelCollection = client.db("dreamDestinyDb").collection("hotel");

    app.get('/hotel', async(req,res) => {
     
     const result = await hotelCollection.find().toArray();
     res.send(result);
      });


      app.get('/hotel/:id', async(req,res) => {
        const id = req.params.id
        const query= {_id: new ObjectId(id)}
        const result = await hotelCollection.findOne(query)
        res.send(result)
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




app.get('/', (req,res) => {
    res.send('dreamy destiny is siting')
});

app.listen(port, () => {
    console.log(`dreamy destiny is sitting on port ${port}`)
})