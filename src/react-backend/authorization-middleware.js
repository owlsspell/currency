const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = () => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    console.log(jwt.verify(token, config.JWT_SECRET));
    if (jwt.verify(token, config.JWT_SECRET)) {
      next();
      // return res.send("True");
    } else {
      return res.status(401).send("Invalid token");
    }
  };
};
