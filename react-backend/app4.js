var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorize = require("./authorization-middleware");
const config = require("./config");
const app = express();
// const port = 8080;
const port = process.env.PORT || 8080;
// const port = 8081;

const _ = require("lodash");
const client = require("./db");
const autoRouter = require("./routes/routes");
const fs = require("fs");

const { Sequelize, DataTypes, Model } = require("sequelize");
const path = require("path");
// var mime = require("mime");
var mime = require("mime-types");

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
    res.send(data);
  });
});

app.get("/readImg", (req, res) => {
  res.setHeader("Content-disposition", "attachment; filename=" + "filename");
  res.setHeader("Content-type", "image/jpg");
  req.setEncoding("base64");
  const filestream = fs.createReadStream("result.jpg", "base64");
  filestream.pipe(res);
  console.log(res);
  // fs.readFile("result.jpg", (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  //   res.send(data);
  // });
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

// app.post("/uploadFile2", (req, res) => {
//   const file = fs.createWriteStream("testFile.txt");
//   const request = app.get("/getFile.txt", function (response) {
//     response.pipe(file);
//   });
//   console.log(request);
//   res.send(request);
// });

app.post("/download", async function (req, res) {
  // let file = __dirname + "/img/pict.jpeg";
  // let filename = path.basename(file);
  // res.setHeader("Content-disposition", "attachment; filename=" + filename);

  // let buf = req.buffer;
  // console.log(buf);
  // await console.log(buf.toString(buf));
  // buf.toString();
  // console.log(req);
  // let readableStream = fs.createReadStream("testFile.txt", "utf8");

  // const filestream = fs.createReadStream(file);
  // filestream.pipe(res);

  // let writeableStream = fs.createWriteStream("result.txt");
  let data = "";
  // let filestream = fs.createReadStream(data);

  req.on("data", function (chunk) {
    // writeableStream.write(chunk);

    data += chunk;
  });

  req.on("end", function () {
    // console.log(data);
    // let messageToDecrypt = Buffer.from(data, "base64");
    // console.log(messageToDecrypt);

    // let writeableStream = fs.createWriteStream("result.txt");

    res.send(data);
  });

  // res.send("Complete");
});

app.post("/downloadImg", async function (req, res) {
  let data = "";
  res.setHeader("Content-disposition", "attachment; filename=" + "filename");
  res.setHeader("Content-type", "image/jpg");
  // let file = __dirname + "/img/1.jpg";
  // let readableStream = fs.createReadStream(file, "base64");
  // let writeableStream = fs.createWriteStream("result.jpg");
  // console.log(res);
  req.on("data", function (chunk) {
    data += chunk;
    // let readableStream = fs.createReadStream(chunk, "base64");

    // fs.writeFileSync(__dirname + `/img/2.jpg`, chunk, "base64");
    fs.readFile(__dirname + `/img/2.jpg`, chunk, "base64", () => {});

    // filestream.pipe(res);
    // req.pipe(data);
  });

  // var mimetype = mime.lookup(file);

  // readableStream.on("data", function (chunk) {
  //   // let img = fs.readFile(chunk, "base64", () => {});
  //   // console.log(img);

  //   writeableStream.write(chunk, "base64");
  // });
  // readableStream.pipe(res);

  // let writeableStream = fs.createWriteStream("result.txt");

  // req.on("data", (chunk) => {
  //   fs.writeFileSync(__dirname + "/img/2.jpg", chunk, "base64");
  //   req.pipe(chunk);
  // });
  // readableStream.pipe(res);
  // res.send("data");

  // req.pipe(chunk);
});

app.post("/downloadImg2", async function (req, res) {
  let file = __dirname + "/img/1.jpg";

  // let readableStream = fs.createReadStream(file, "base64");
  // let writeableStream = fs.createWriteStream("result.jpg");
  // req.on("data", function (chunk) {
  //   // let img = fs.readFile(chunk, "base64", () => {});
  //   // console.log(img);
  //   console.log(chunk);

  //   writeableStream.write(chunk, "base64");
  // });
  // // let writeableStream = fs.createWriteStream("result.txt");
  let data = "";
  req.on("data", function (chunk) {
    data += chunk;
  });

  fs.readFile("/Users/flavio/test.txt", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });

  res.send("data");

  // res.send("Complete");
});

app.get("/readImg3", async function (req, res) {
  req.setEncoding("base64");
  req.on("data", (chunk) => {
    fs.appendFileSync(__dirname + "/upload/" + "file.jpg", chunk, "base64");
    // console.log(chunk);
  });

  req.on("end", () => {
    try {
      const filename = path.basename("/upload/file.jpg");
      const mimetype = mime.lookup(filename);
      console.log(mimetype);
      console.log(filename);

      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimetype);
      // let readableStream = fs.createReadStream("./upload/file.jpg");
      // fs.writeFileSync(__dirname + "/upload/" + filename, body, "base64");
      res.end();

      // req.pipe(res);
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });

  // res.send("Complete");
});

app.get("/downloadA", async function (req, res) {
  let file = "";
  req.setEncoding("base64");

  req.on("data", function (chunk) {
    file += chunk;
    // console.log(chunk);
  });

  req.on("end", function () {
    try {
      const filename = path.basename(file);
      const mimetype = mime.lookup(file);
      // console.log(file);
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimetype);
      //res.setHeader("Content-type", "image/jpg");
      fs.writeFileSync("./upload/" + filename, file, "base64");
      res.send(file);

      const filestream = fs.createReadStream(file);
      filestream.pipe(res, "base64");
    } catch (err) {
      res.statusCode = 400;
      return res.end(`error: ${err.message}`);
    }
  });
});

app.post("/readFile2", async function (req, res) {
  let body = "";
  res.setHeader("Content-disposition", "attachment; filename=" + "filename");
  res.setHeader("Content-type", "image/jpg");
  req.setEncoding("base64");

  req.on("data", (chunk) => {
    body += chunk;

    fs.writeFile(__dirname + `/upload/test.jpg`, body, "base64", (data) => {});
    // console.log(chunk.length);
  });

  req.on("end", () => {
    try {
      // req.pipe(res);
      res.send(body);
      // body.pipe(res);
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });

  // res.send("Complete");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

module.exports = router;
