const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "You are not authenticated!" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing!" });
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.error(
      "JWT_SECRET_KEY is not defined in the environment variables.",
    );
    return res.status(500).json({ error: "Internal server error" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid!" });
    }

    req.user = user;
    next();
  });
};
