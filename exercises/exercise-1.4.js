const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise-1");
  const { name } = req.body;
  if (name) {
    await db.collection("users").insertOne({ name: name });

    res.status(200).json({ status: 200, data: name });
  } else {
    res.status(404).json({ status: 404, message: "Error in POST" });
  }
  client.close();
};

module.exports = { addUser };
