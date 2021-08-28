const client = require("../db");

class CarsControler {
  //1
  async getAllOrders(req, res, next) {
    client.query(" SELECT  COUNT(*) FROM orders", [], (err, result) => {
      return res.json({ result: result.rows[0] });
    });
  }
  //2
  async getCountModel(req, res, next) {
    client.query(
      "SELECT  name_model, COUNT(*) FROM orders LEFT JOIN models on(models.id_model= orders.id_model) GROUP BY (name_model);",
      [],
      (err, result) => {
        res.json({ result: result.rows });
      }
    );
  }

  //3
  async getCountBrand(req, res, next) {
    client.query(
      "SELECT brands.brand, COUNT(id_order) FROM brands INNER JOIN models on(brands.id = models.id_brand) INNER JOIN orders on(orders.id_model = models.id_model) GROUP BY (brands.brand);",
      [],
      (err, result) => {
        res.json({ result: result.rows });
      }
    );
  }
  //4
  async getSumModel(req, res, next) {
    client.query(
      "SELECT name_model, SUM(retail_price) FROM orders INNER JOIN models on(models.id_model= orders.id_model) group by (name_model)",
      [],
      (err, result) => {
        res.json({ result: result.rows });
      }
    );
  }
  //5
  async getSumBrands(req, res, next) {
    client.query(
      "SELECT brands.brand, SUM(retail_price) FROM brands INNER JOIN models on(brands.id = models.id_brand) INNER JOIN orders on(orders.id_model = models.id_model) GROUP BY (brands.brand);",
      [],
      (err, result) => {
        res.json({ result: result.rows });
      }
    );
  }
  //6
  async getProfitable(req, res, next) {
    client.query(
      "SELECT name_model, SUM(retail_price-price) as difference FROM orders LEFT JOIN models on(models.id_model= orders.id_model) GROUP BY (name_model) ORDER BY difference DESC",
      [],
      (err, result) => {
        res.json({ result: result.rows });
      }
    );
  }
  //7
  async getNotProfitable(req, res, next) {
    client.query(
      "SELECT name_model, SUM(retail_price-price) as difference FROM orders LEFT JOIN models on(models.id_model= orders.id_model) GROUP BY (name_model) ORDER BY difference;",
      [],
      (err, result) => {
        res.json({ result: result.rows });
      }
    );
  }
}

module.exports = new CarsControler();
