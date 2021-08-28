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

const { Sequelize, DataTypes, Model } = require("sequelize");

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

const sequelize = new Sequelize("baseA", "developer", "123456", {
  host: process.env.POSTGRES_HOST || "db",
  dialect: "postgres",
});

class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    // birthday: {
    //   type: DataTypes.DATEONLY,
    //   defaultValue: DataTypes.NOW,
    //   allowNull: false,
    // },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
    tableName: "users",
    timestamps: false,
  }
);

// (async () => {
//   await sequelize.sync();
//   const jane = await Person.create({
//     firstName: "OOO",
//     birthday: new Date(1980, 6, 20),
//   });
//   console.log(jane.toJSON());
// })();

// Person.sync();

// async function getJane() {
//   // try {
//   //   await sequelize.authenticate();
//   //   console.log("Connection has been established successfully.");
//   // } catch (error) {
//   //   console.error("Unable to connect to the database:", error);
//   // }
//   const jane = await Person.create({ firstName: "Jane" });

//   await console.log(jane.toJSON());
//   // await console.log(jane.name);
// }

// console.log(sequelize.models.Person);

// getJane();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  (async () => {
    await sequelize.sync({ alter: true });
    const userInfo = await User.findOne({
      where: { id: token.id },
    });
    console.log(userInfo);

    const user = userInfo.toJSON();
    return res.json({
      id: user.id,
      name: user.name || null,

      avatar: user.avatar || null,
    });
  })();
});

app.post("/login/", function (req, res, next) {
  //find user by username
  console.log(req.body.authData);
  //if user exist -> compare passwords

  //return error or result
  // knex
  //   .select()
  //   .from("users")
  //   .where("email", req.body.authData.email)
  //   .asCallback((err, rows) => {

  (async () => {
    // try {
    await sequelize.sync({ alter: true });
    await User.findOne({
      where: { email: req.body.authData.email },
    })
      .then((userInfo) => {
        if (userInfo === null) {
          return res.status(401).send("Invalid email");
        }
        const user = userInfo.toJSON();
        let hashedPassword = crypto
          .createHash("sha256")
          .update(req.body.authData.password)
          .digest("hex");

        if (hashedPassword !== user.password) {
          return res.status(401).send("Invalid password");
        }
        let token = jwt.sign(
          {
            id: user.id,
            email: req.body.authData.email,
            password: hashedPassword,
          },
          config.JWT_SECRET
        );
        return res.json({ token: token });
        // } catch (err) {
        //   throw err;
        // }}
      })
      .catch((err) => {
        throw err;
      });
  })();

  // let user = _.find(users, { name: data.authData.email });
  // if (!user) {
  //   return res.status(401).send("Invalid email");
  // }
});

app.post("/logup", function (req, res, next) {
  (async () => {
    const { email, password } = req.body;
    console.log(req.body);
    let hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    await sequelize.sync();
    await User.create({
      email: email,
      password: hashedPassword,
    });
    return res.status(201).send("logup");
  })();

  // knex("users")
  //   .insert({ email: email, password: hashedPassword })
  //   .asCallback((error, result) => {
  //     if (error) {
  //       throw error;
  //     }
  //     let token = jwt.sign(
  //       { email: req.body.email, password: hashedPassword },
  //       config.JWT_SECRET
  //     );

  // return res.status(201).json({ token: token });

  // client.end();
  // });
});

app.post("/changeUserData", authorize(), (req, res) => {
  console.log(req.body);

  (async () => {
    await sequelize.sync({ alter: true });
    const userInfo = await User.findOne({
      where: { id: req.body[1].id },
    });
    const user = userInfo.toJSON();
    console.log("userInfo");
    console.log(userInfo);
    if (req.body[0].name) {
      userInfo.name = req.body[0].name;
      await userInfo.save();
    }
    if (req.body[0].email) {
      user.email = req.body[0].email;
      await userInfo.save();
    }
    console.log(user);

    // await userInfo.reload();
    // await userInfo.save();
  })();
  // const token = jwt.verify(req.headers.authorization, config.JWT_SECRET);

  // if (req.body[0].name) {
  //   knex("users")
  //     .where("id", req.body[1].id)
  //     .update("name", req.body[0].name)
  //     .asCallback((error, result) => {});
  // }
  // if (req.body[0].email) {
  //   knex("users")
  //     .where("id", req.body[1].id)
  //     .update("email", req.body[0].email)
  //     .asCallback((error, result) => {});
  // }
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

app.post("/setOrder", function (req, res, next) {
  let { brand, price, userId } = req.body;
  // console.log(userId);
  knex("orders")
    .insert({
      order_name: brand,
      user_id: userId,
      count_item: "1",
      price: price,
    })
    .asCallback((err, result) => {
      // res.json({ goods: result.rows });
    });
  console.log(req.body);
  // console.log(brand);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}...`);
});

module.exports = router;
