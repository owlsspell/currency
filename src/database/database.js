const { Client } = require("pg");

//Base

const client = new Client({
  user: "developer",
  host: "http://localhost:3030/",
  database: "baseA",
  password: "123456",
  port: 5432,
});

client.connect();

client.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  client.end();
});
