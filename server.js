const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const bodyParser = require("body-parser");

connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use("/auth", require("./routes/auth"));
app.listen(5000);
