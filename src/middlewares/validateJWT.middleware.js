const jwt = require("jsonwebtoken");

const { debugPrint } = require("../utils/debug");

const validateJWT = (req, res, next) => {
  try {
    const token =
      req.params.token ||
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        // debugPrint(error);
        if (error.name === "TokenExpiredError") {
          return res.status(400).json({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
          return res.status(400).json({ message: "Invalid token or signature" });
        } else {
          return res.status(400).json({ message: error.message });
        }
      }

      req.user = decoded;
      next();
    });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { validateJWT };
