const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


// middlewares
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true,               // Allow credentials (cookies, etc.)
  })
);
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
    const bookingCollection = client.db('dreamDestinyDb').collection('bookings');
    const reviewCollection = client.db('dreamDestinyDb').collection('reviews');



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

      app.get('/hotel', async (req, res) => {
        const { minPrice, maxPrice } = req.query;
        console.log(req.query);
        const cursor = hotelCollection.find({
            price_per_night: {
                $gte: parseInt(minPrice),
                $lte: parseInt(maxPrice)
            }
        });
        const result = await cursor.toArray();
        console.log(result);
        res.json(result);
    });



      app.post('/bookings', async (req, res) => {
        const booking = req.body;
        console.log(booking);
        const result = await bookingCollection.insertOne(booking);
        res.send(result)
    })



      app.get('/bookings', async (req, res) => {
        const cursor = bookingCollection.find();
        const result = await cursor.toArray();
        res.send(result)

    });


    // get my booking data by email
    app.get("/my-bookings/:email", async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
  });


   // update date
   app.patch('/bookings/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const updateDoc = {
        $set: {
            checkInDate: req.body.checkInDate,
            checkOutDate: req.body.checkOutDate
        }
    };
    const result = await bookingCollection.updateOne(query, updateDoc);
    res.send(result)

});


 // cancel booking
 app.delete('/bookings/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bookingCollection.deleteOne(query);
  res.send(result)
});


    app.get('/reviews', async(req,res)=> {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result)
  })

  app.post('/reviews', async(req,res)=> {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
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