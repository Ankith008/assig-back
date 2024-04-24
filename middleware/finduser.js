const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const findUser = async (req, res, next) => {
  const token = req.header("authtoken");
  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified.user.id);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = findUser;
