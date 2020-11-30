const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  //creates new client
  const client = await MongoClient(MONGO_URI, options);
  //connect to client
  await client.connect();
  //connect to database
  const db = client.db(dbName);
  console.log("connected!");
  //add data
  await db.collection("users").insertOne({ name: "Buck Rogers" });
  //close connection to db server
  client.close();
  console.log("disconnected!");
};

dbFunction("exercise-1");
