var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorize = require("./authorization-middleware");
const config = require("./config");
const app = express();
const port = 8081;
const _ = require("lodash");
const client = require("./db");
const autoRouter = require("./routes/routes");

// const tasks = require("./tasksWithAuto");

// const { Client } = require("pg");

//Base
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST || "db",
    user: "developer",
    password: "123456",
    database: "baseA",
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// client.connect();

app.use("/", autoRouter);

// console.log(knex.migrate);

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

app.get("/blog/", authorize(), function (req, res, next) {
  return res.send("You blog");
});

app.get("/getUser/", authorize(), function (req, res, next) {
  const token = jwt.verify(req.headers.authorization, config.JWT_SECRET);
  // console.log(token);
  knex
    .select("id", "name", "email", "avatar")
    .from("users")
    .where("id", token.id)
    .asCallback((err, rows) => {
      console.log(rows);
      return res.json({
        id: rows[0].id,
        name: rows[0].name || null,

        avatar: rows[0].avatar || null,
      });
    });
});

app.post("/login/", function (req, res, next) {
  //find user by username

  //if user exist -> compare passwords

  //return error or result
  knex
    .select()
    .from("users")
    .where("email", req.body.authData.email)
    .asCallback((err, rows) => {
      if (err) {
        throw error;
      }
      if (!rows[0]) {
        return res.status(401).send("Invalid email");
      }

      let hashedPassword = crypto
        .createHash("sha256")
        .update(req.body.authData.password)
        .digest("hex");

      if (hashedPassword !== rows[0].password) {
        return res.status(401).send("Invalid password");
      }
      let token = jwt.sign(
        {
          id: rows[0].id,
          email: req.body.authData.email,
          password: hashedPassword,
        },
        config.JWT_SECRET
      );
      return res.json({ token: token });
    });

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

  // const query = {
  //   text: "INSERT INTO users(email,password) VALUES ($1,$2)",
  //   values: [email, hashedPassword],
  // };
  knex("users")
    .insert({ email: email, password: hashedPassword })
    .asCallback((error, result) => {
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
    knex("users")
      .where("id", req.body[1].id)
      .update("name", req.body[0].name)
      .asCallback((error, result) => {});
  }
  if (req.body[0].email) {
    knex("users")
      .where("id", req.body[1].id)
      .update("email", req.body[0].email)
      .asCallback((error, result) => {});
  }
});

//User orders

app.get("/orders", authorize(), function (req, res, next) {
  const token = jwt.verify(req.headers.authorization, config.JWT_SECRET);
  // console.log(token);
  knex("orders")
    .where("user_id", token.id)
    .asCallback((err, rows) => {
      console.log(rows);
      res.json({ orders: rows });
    });
});

//Shop

app.get("/getGoods", function (req, res, next) {
  knex("shop")
    .orderBy("id")
    .asCallback((err, rows) => {
      res.json({ goods: rows });
    });
});

app.post("/setOrder", async function (req, res, next) {
  let { brand, price, userId } = req.body;
  // console.log(userId);
  await knex("orders").insert({
    order_name: brand,
    user_id: userId,
    count_item: "1",
    price: price,
  });
  // .then();

  // .asCallback((err, result) => {
  //   // res.json({ goods: result.rows });
  // });
  console.log(req.body);
  // console.log(brand);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

module.exports = router;
