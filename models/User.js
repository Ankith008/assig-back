const mongoose = require("mongoose");
const { Schema } = mongoose;

const Userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  apikey: {
    type: String,
    required: true,
  },
  subcribtion: {
    subDate: {
      type: String,
    },
    sublist: [
      {
        date: String,
        count: Number,
      },
    ],
    expDate: {
      type: String,
    },
  },
});

module.exports = mongoose.model("User", Userschema);
