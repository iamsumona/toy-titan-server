const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
//i7ljsjf9fROInEpk
//CoffeeAdmin



const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.c6qt32p.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.c6qt32p.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("coffeeDB");
    const usersCollection = database.collection("newCoffee");


    // const indexKeys = { toyName: 1,  }; 
    // const indexOptions = { name: "toyNameCategory" }; 
    // const result = await usersCollection.createIndex(indexKeys, indexOptions);

    // app.get("/searchToyName/:text", async (req, res) => {
    //   const text = req.params.text;
    //   const result = await usersCollection
    //     .find({
    //       $set: [
    //         { toyName: { $regex: text, $options: "i" } },
    //       ],
    //     })
    //     .toArray();
    //   res.send(result);
    // });
    
    app.get('/alltoys',async(req,res)=>{
      const cursor=usersCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    
    app.get('/',async(req,res)=>{
      const cursor=usersCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    
    app.get('/alltoys/:sellerEmail',async(req,res)=>{
      const id= req.params.id
      const query={sellerEmail: req.params.sellerEmail}
      const result=await usersCollection.find(query).toArray()
      res.send(result)
      // console.log(req.params.sellerEmail);
    })
    

    app.post('/addatoy',async(req,res)=>{
      const newCoffee=req.body;
      console.log('new Coffee',newCoffee);
      const result = await usersCollection.insertOne(newCoffee);
      res.send(result)

    })

    app.get('/alltoys/:id',(req,res)=>{
      // res.send(chefInfo_RecipeDetails)
      const id=req.params.id
      // console.log(id);
      const selectedRecipe=usersCollection.findOne(n=>n._id == id)
      console.log(selectedRecipe);
      res.send(selectedRecipe)
  })
    app.get('/mytoys/:id',(req,res)=>{
      // res.send(chefInfo_RecipeDetails)
      const id=req.params.id
      // console.log(id);
      const selectedRecipe=usersCollection.findOne(n=>n._id == id)
      // console.log(selectedRecipe);
      res.send(selectedRecipe)
  })




    app.put('/addcoffee/:id',async(req,res)=>{
      const id= req.params.id
      const user=req.body
      console.log(user);
      const filter={_id : new ObjectId(id)}
      const options={upsert:true}
      const updateCoffee=req.body
      const coffee = {
      $set: {
        coffeeName:updateCoffee.coffeeName, 
        quantity :updateCoffee.quantity,
        supplier :updateCoffee.supplier,
        catagory :updateCoffee.catagory,
        details :updateCoffee.details,
        taste :updateCoffee.taste,
        photoURL :updateCoffee.photoURL
      },

    };
    const result=await usersCollection.updateOne(filter,coffee,options)
    res.send(result)
    })

    app.delete('/mytoys/:id',async(req,res)=>{
      const id=req.params.id
      // console.log("please delete from db",id);
      const query={_id : new ObjectId(id)}
      const result=await usersCollection.deleteOne(query)
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


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
