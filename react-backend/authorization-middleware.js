const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = () => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (jwt.verify(token, config.JWT_SECRET)) {
      next();
    } else {
      return res.status(401).send("Invalid token");
    }
  };
};
