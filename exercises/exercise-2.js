const { MongoClient } = require("mongodb");
const assert = require("assert");
const { request } = require("http");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  console.log(req);
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected");
    const db = client.db("exercises");
    const { lang, _id, hello } = req.body;
    const result = await db
      .collection("greeting")
      .insertOne({ lang, _id, hello });
    assert.equal(1, result.insertedCount);
    res.status(200).json({ status: 200, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const client = MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");
  const _id = req.params._id;

  db.collection("greeting").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");
  db.collection("greeting")
    .find()
    .toArray((err, result) => {
      console.log(result);
      if (result.length) {
        const start = req.query.start ? Number(req.query.start) : 0;
        console.log(start);
        const limit =
          !req.query.limit || req.query.limit > result.length - 1
            ? result.length - 1
            : Number(req.query.limit);
        console.log(limit);
        const slicedResult = result.slice(start, limit + start);
        console.log(slicedResult);
        res.status(200).json({ status: 200, data: slicedResult });
      } else {
        res.status(404).json({ status: 404, _id, data: "Not Found" });
      }

      client.close();
    });
};

const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");
  try {
    const result = await db
      .collection("greeting")
      .deleteOne({ _id: req.params._id });
    assert.equal(1, result.deletedCount);
    res.status(204).json({ status: 204, data: result });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;

  if (!hello) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message: 'Only "hello" may be updated.',
    });
    return;
  }

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");
  try {
    const query = { _id: _id.toUpperCase() };
    const newValues = { $set: { hello } };
    const result = await db.collection("greeting").updateOne(query, newValues);
    assert.equal(1, result.matchedCount);
    assert.equal(1, result.modifiedCount);
    res.status(200).json({ status: 200, _id });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
