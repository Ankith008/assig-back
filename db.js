const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://ankithhh2003:TsKbgHUZr6IPKOIA@apiassignment.x1ljnwy.mongodb.net/"
    );
    console.log("MongoDB is connected");
  } catch (err) {
    console.log("Unable to connect to the database");
  }
};

module.exports = connectDB;
