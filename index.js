const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// use dynamic database

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.kisk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("cyberClinic").collection("product");

    // http://localhost:5000/home
    app.get("/home", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    app.get("/item", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    app.post("/add", async (req, res) => {
      const newProduct = req.body;
      const product = await productCollection.insertOne(newProduct);
      res.send(product);
    });

    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.deleteOne(query);
      res.send(product);
    });

    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateProduct.quantity,
        },
      };
      const product = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(product);
    });
  } finally {
    //   free
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("connect");
});

app.listen(port, () => {
  console.log("db connected", port);
});
