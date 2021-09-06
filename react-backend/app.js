var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorize = require("./authorization-middleware");
const config = require("./config");
const app = express();
const port = process.env.PORT || 8080;
const _ = require("lodash");
const client = require("./db");
const autoRouter = require("./routes/routes");
var cors = require("cors");
const fs = require("fs");
const path = require("path");
// var mime = require("mime");
var mime = require("mime-types");
const multer = require("multer");
const getRawBody = require("raw-body");
const contentType = require("content-type");
// const tasks = require("./tasksWithAuto");

// const { Client } = require("pg");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(function (req, res, next) {
//   getRawBody(
//     req,
//     {
//       length: req.headers["content-length"],
//       limit: "1000mb",
//       encoding: contentType.parse(req).parameters.charset,
//     },
//     function (err, string) {
//       if (err) return next(err);
//       req.text = string;
//       next();
//     }
//   );
// });

// app.get("/getInfo", function (req, res, next) {
//   return res.send("WORKED");
// });

//Base

// const client = new Client({
//   user: "developer",
//   host: process.env.POSTGRES_HOST || "db",
//   database: "baseA",
//   password: "123456",
//   port: 5432,
// });

// module.exports.client = client;

// const client = new Client({
//   user: "developer",
//   host: process.env.POSTGRES_HOST || "db",
//   database: "cars_db",
//   password: "123456",
//   port: 5432,
// });
app.use(cors());
client.connect();
app.use("/upload", express.static(path.join(__dirname + "/upload")));

app.post("/readImg", async function (req, res) {
  // const { name, avatar } = req.body;
  req.setEncoding("base64");

  // console.log(req.body);
  // console.log(file);

  let file = req.body[1].split(",")[1];

  req.on("data", (chunk) => {
    console.log("chunk");
    console.log(chunk);
    fs.appendFileSync(__dirname + "/upload/" + "file.jpg", chunk, "base64");
  });

  fs.writeFileSync(__dirname + "/upload/" + "file.jpg", file, "base64");
});

//Multer

// const upload = multer({ dest: "upload" });

// app.post("/upload", upload.single("filedata"), function (req, res, next) {
//   let filedata = req.file;

//   console.log(filedata);
//   if (!filedata) res.send("Ошибка при загрузке файла");
//   // else res.send("Файл загружен");
//   else console.log("Файл загружен");
// });

// app.post("/upload", (req, res) => {
// let file = req.body.avatar.split(",")[1];

// var fileWriteStream = fs.createWriteStream("./upload/" + req.body.name);
// fileWriteStream.on("finish", () => {
//   console.log("file saved successfully");
//   res.send({ message: "file saved successfully" });
// });
// const filename = path.basename(`./upload/` + req.body.name);
// const mimetype = mime.lookup(filename);
// res.setHeader("Content-type", mimetype);
// // let readableStream = fs.createReadStream("./upload/file.jpg");
// // fs.writeFileSync(__dirname + "/upload/" + filename, body, "base64");
// // res.end();
// fileWriteStream.end(file);
// });

app.post("/sendmanyFile", async function (req, res) {
  // console.log(req.body);
  req.setEncoding("base64");

  fs.writeFileSync(
    __dirname + "/files-upload/" + req.body.name,
    req.body.result,
    "base64"
  );
  const mimetype = mime.lookup(req.body.name);

  res.setHeader("Content-disposition", "attachment; filename=" + req.body.name);
  res.setHeader("Content-type", mimetype);
  res.end();
});

app.post("/profile/download5", async function (req, res) {
  // console.log(req.body);

  let name = req.headers["file-name"];
  req.setEncoding("base64");
  fs.writeFileSync(__dirname + "/upload/" + name, "", "base64");

  req.on("data", (chunk) => {
    // console.log("chunk", chunk);
    fs.appendFileSync(__dirname + "/upload/" + name, chunk, "base64");
  });

  req.on("end", () => {
    try {
      const filename = path.basename("/upload/" + name);
      const mimetype = mime.lookup(filename);

      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimetype);
      let readableStream = fs.createReadStream("./upload/" + name, "base64");
      // fs.writeFileSync(__dirname + "/upload/" + filename, body, "base64");
      // res.end();

      // req.pipe(res);
      // readableStream.pipe(res);
      res.send(name);
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

app.post("/updateAvatar", (req, res) => {
  const id = req.headers["user-id"];
  const name = req.headers["name-picture"];

  const avatar = req.body;

  client.query(
    "UPDATE users SET avatar=$1 WHERE id=$2",
    [name, id],
    (err, result) => {
      // console.log(result);
      // return res.json({
      //   // avatar: result.rows[0].avatar || null,
      // });
    }
  );
});

app.use("/", autoRouter);

/*
1. Registration
Send email & password -> Backend /registration
Backend -> password -> hash password-> store new user to db -> create token
Token -> Frontend -> localStorage

2. Login
Send email & passowrd -> Backend /login
Backend -> password -> hash password -> find user in DB and compare password
Token -> Frontend -> localStorage

3. ANY REQUEST /blog-posts
Send token from localStorage in HEADERS -> Backend /blog-posts
Check if token jwt.verify returns true
Send data from protected endpoint to user

*/

app.get("/protected", authorize(), function (req, res, next) {
  // console.log(req.headers);
  const token = req.headers.Authorization;
  console.log(token);
  jwt.verify(token, config.JWT_SECRET);
  return res.json({});
});

// app.get("/secret", function (req, res, next) {
//   const token = req.headers.authorization;
//   console.log(jwt.verify(token, config.JWT_SECRET));
//   if (jwt.verify(token, config.JWT_SECRET)) {
//     // next();
//     return res.send("True");
//   }
// });
app.get("/blog/", function (req, res, next) {
  return res.send("You blog");
});

app.get("/getUser/", authorize(), function (req, res, next) {
  const token = jwt.verify(req.headers.authorization, config.JWT_SECRET);
  // console.log(token);
  client.query(
    "SELECT id, name,email,avatar FROM users WHERE id=$1;",
    [token.id],
    (err, result) => {
      console.log(result.rows);
      return res.json({
        id: result.rows[0].id,
        name: result.rows[0].name || null,

        avatar: result.rows[0].avatar || null,
      });
    }
  );
});

app.post("/login/", function (req, res, next) {
  //find user by username

  //if user exist -> compare passwords

  //return error or result

  client.query(
    "SELECT * FROM users WHERE email=$1",
    [req.body.authData.email],
    (err, result) => {
      if (err) {
        throw error;
      }

      if (!result.rows[0]) {
        return res.status(401).send("Invalid email");
      }

      let hashedPassword = crypto
        .createHash("sha256")
        .update(req.body.authData.password)
        .digest("hex");

      if (hashedPassword !== result.rows[0].password) {
        return res.status(401).send("Invalid password");
      }
      let token = jwt.sign(
        {
          id: result.rows[0].id,
          email: req.body.authData.email,
          password: hashedPassword,
        },
        config.JWT_SECRET
      );
      return res.json({ token: token });
    }
  );

  // let user = _.find(users, { name: data.authData.email });
  // if (!user) {
  //   return res.status(401).send("Invalid email");
  // }
});

app.post("/logup", function (req, res, next) {
  // var token = jwt.sign(req.body, config.JWT_SECRET);
  const { email, password } = req.body;

  let hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  // let user = { name: req.body.email, password: hashedPassword };
  // users.push(user);

  const query = {
    text: "INSERT INTO users(email,password) VALUES ($1,$2)",
    values: [email, hashedPassword],
  };

  client.query(query, (error, result) => {
    if (error) {
      throw error;
    }
    let token = jwt.sign(
      { email: req.body.email, password: hashedPassword },
      config.JWT_SECRET
    );

    // return res.status(201).json({ token: token });
    return res.status(201).send("logup");

    // client.end();
  });
});

app.post("/changeUserData", authorize(), (req, res) => {
  console.log(req.body);

  // const token = jwt.verify(req.headers.authorization, config.JWT_SECRET);

  if (req.body[0].name) {
    client.query(
      "UPDATE users SET name=$1 WHERE id=$2",
      [req.body[0].name, req.body[1].id],
      (err, result) => {}
    );
    // console.log(name);
  }
  if (req.body[0].email) {
    client.query(
      "UPDATE users SET email=$1 WHERE id=$2",
      [req.body[0].email, req.body[1].id],
      (err, result) => {}
    );
  }
});

//User orders

app.get("/orders", authorize(), function (req, res, next) {
  const token = jwt.verify(req.headers.authorization, config.JWT_SECRET);
  // console.log(token);
  client.query(
    "SELECT * FROM orders WHERE user_id=$1",
    [token.id],
    (err, result) => {
      res.json({ orders: result.rows });
    }
  );
});

//Shop

app.get("/getGoods", function (req, res, next) {
  client.query("SELECT * FROM shop ORDER BY id;", (err, result) => {
    res.json({ goods: result.rows });
  });
});

app.post("/setOrder", function (req, res, next) {
  let { brand, price, userId } = req.body;
  // console.log(userId);
  client.query(
    "INSERT INTO orders(order_name,user_id,count_item,price) VALUES ($1,$2,1,$3);",
    [brand, userId, price],
    (err, result) => {
      // res.json({ goods: result.rows });
    }
  );
  console.log(req.body);
  // console.log(brand);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

module.exports = router;
