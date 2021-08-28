const { Client } = require("pg");

const client = new Client({
  user: "developer",
  host: process.env.POSTGRES_HOST || "db",
  // host: "localhost",
  database: "baseA",
  // database: "cars_db",
  password: "123456",
  port: 5432,
});

module.exports = client;
