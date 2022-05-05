const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// use dynamic database

const uri =
  "mongodb+srv://userId3:nZg8UvSJ6zeg8COC@cluster0.kisk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
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
  console.log("db one", port);
});
