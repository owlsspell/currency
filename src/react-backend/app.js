var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorize = require("./authorization-middleware");
const config = require("./config");
const app = express();
const port = 8080;
const _ = require("lodash");

const { Client } = require("pg");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Base

const client = new Client({
  user: "developer",
  host: "localhost",
  database: "baseA",
  password: "123456",
  port: 5432,
});

client.connect();

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

app.get("/protected", function (req, res, next) {
  console.log(req.headers);
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

app.get("/profile/", authorize(), function (req, res, next) {
  const name = jwt.verify(req.headers.authorization, config.JWT_SECRET);
  return res.json({ name: name.email });
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
        { email: req.body.authData.email, password: hashedPassword },
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

    return res.status(201).json({ token: token });
    // client.end();
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

module.exports = router;
