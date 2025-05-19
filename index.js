const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sifatahamed0.ruxo7fd.mongodb.net/?retryWrites=true&w=majority&appName=sifatAhamed0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const coffeesCollection = client.db("coffeesDb").collection("coffees");

    app.get("/coffees",async(req,res)=>{
      const cursor = coffeesCollection.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    app.get('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffees',async(req,res)=>{
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const options = { upsert: true };
      const updateCoffee = req.body;
      const updateDoc = {
        $set: updateCoffee
      }
      const result = await coffeesCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    app.delete('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Coffe store server is Runing");
})
app.listen(port,()=>{
    console.log(`Coffe Store server is Runing Port: ${port}`);
})
