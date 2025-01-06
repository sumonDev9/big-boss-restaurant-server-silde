const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.POST || 5000;  

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqfyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const menuCollection = client.db("bigBossDb").collection("menu");
    const userCollection = client.db("bigBossDb").collection("users");
    const reviewCollection = client.db("bigBossDb").collection("reviews");
    const cartCollection = client.db("bigBossDb").collection("carts");


    //get menu
    app.get('/menu', async(req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result)
    })
    
    // reviwe
    app.get('/reviews', async(req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result)
    })

    // carts collection
    app.post('/carts', async(req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result)
    })

    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })


    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // user related api
    app.post('/users', async(req, res) => {
      const user = req.body;
      // insert email if user doesnt exist:
      const query = {email: user.email}
      const existinUser = await userCollection.findOne(query);
      if(existinUser){
        return res.send({message: 'user alreay exists', insertedId: null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Boss welcome!')
})

app.listen(port, () => {
  console.log(`Big Boss welcome on port ${port}`)
})



/**
 * 
 */