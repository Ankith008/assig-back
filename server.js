const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const bodyParser = require("body-parser");

connectDB();
app.use(cors({ origin: "https://assig-client.vercel.app/" }));
app.use(bodyParser.json());
app.use("/auth", require("./routes/auth"));
app.listen(5000);
