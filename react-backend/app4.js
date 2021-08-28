var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorize = require("./authorization-middleware");
const config = require("./config");
const app = express();
const port = 8080;
const _ = require("lodash");
const client = require("./db");
const autoRouter = require("./routes/routes");
const fs = require("fs");

const { Sequelize, DataTypes, Model } = require("sequelize");

// const tasks = require("./tasksWithAuto");

// const { Client } = require("pg");

//Base
// client.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// fs
app.get("/readFile", (req, res) => {
  console.log("work...");
  fs.readFile("testFile.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  res.send("Complete");
});

app.post("/uploadFile", (req, res) => {
  // const file = fs.createWriteStream("testFile.txt");

  let readableStream = fs.createReadStream("testFile.txt", "utf8");

  let writeableStream = fs.createWriteStream("result.txt");

  readableStream.on("data", function (chunk) {
    writeableStream.write(chunk);
  });
  res.send("Complete");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

module.exports = router;
