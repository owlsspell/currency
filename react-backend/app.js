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

// const tasks = require("./tasksWithAuto");

// const { Client } = require("pg");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

client.connect();

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
