const express = require("express");
const app = express();
const cors = require("cors");
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
  await client.connect();
  const productCollection = client.db("cyberClinic").collection("product");
  try {
    app.get("/home", async (req, res) => {
      const query = req.body;
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
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
