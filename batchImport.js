const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const data = require("./data/greetings.json");
console.log(data);
const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected");
    const db = client.db("exercises");

    const result = await db.collection("greeting").insertMany(data);
    assert.equal(data.length, result.insertedCount);
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

batchImport();
