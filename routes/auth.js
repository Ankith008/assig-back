const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const finduser = require("../middleware/finduser");

router.post("/register", async (req, res) => {
  const data = new Date();
  const currentdate = `${data.getFullYear()}-${
    data.getMonth() + 1
  }-${data.getDate()}`;
  try {
    const { name, email, password, apikey, subpack } = req.body;
    const subpacks = parseInt(subpack);
    const newdate = new Date(currentdate);
    newdate.setDate(newdate.getDate() + subpacks);
    const expDate = `${newdate.getFullYear()}-${
      newdate.getMonth() + 1
    }-${newdate.getDate()}`;

    const user = new User({
      name: name,
      email: email,
      password: password,
      apikey: apikey,
      subcribtion: {
        subDate: `${currentdate}`,
        sublist: [],
        expDate: `${expDate}`,
      },
    });
    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    return res.json({ success: true, authToken });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, error: "Invalid credentials" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User Not Found" });
    }
    if (password !== user.password) {
      return res.json({ error: "Invalid credentials" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    return res.json({ success: true, authToken });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, error: "Invalid credentials" });
  }
});

router.post("/createapikey", finduser, async (req, res) => {
  try {
    const { apikey } = req.body;
    const user = await User.findByIdAndUpdate(req.user, { apikey: apikey });
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, error: "Error in creating the api key" });
  }
});

router.post("/getapikey", finduser, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    return res.json({ success: true, apikey: user.apikey });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, error: "Error in getting the api key" });
  }
});

router.post("/deleteapikey", finduser, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user, { apikey: "" });
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, error: "Error in deleting the api key" });
  }
});

router.post("/updatesubpack", finduser, async (req, res) => {
  try {
    const { subpack } = req.body;
    const subpacks = parseInt(subpack);
    const currentdate = new Date();
    const todaydate = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;
    const exp = new Date(todaydate);
    exp.setDate(exp.getDate() + subpacks);
    const expdate = `${exp.getFullYear()}-${
      exp.getMonth() + 1
    }-${exp.getDate()}`;

    const user = await User.findByIdAndUpdate(
      req.user,
      {
        $set: {
          "subcribtion.subDate": todaydate,
          "subcribtion.expDate": expdate,
          "subcribtion.sublist": [],
        },
      },
      { new: true }
    );
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post("/sendrequest", finduser, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const userapikey = user.apikey;
    const { apikey } = req.body;
    const expdate = user.subcribtion.expDate;

    const currentdate = new Date();
    const todaydate = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;
    if (apikey !== userapikey)
      return res.json({ success: false, err: "Please Enter a valid Api key" });

    const date1 = new Date(todaydate);
    const date2 = new Date(expdate);

    if (date1 > date2)
      return res.json({
        success: false,
        err: " Please renew you subscription",
      });

    const sublist = user.subcribtion.sublist.find(
      (ele) => ele.date === todaydate
    );
    if (sublist) {
      sublist.count++;
    } else {
      user.subcribtion.sublist.push({ date: todaydate, count: 1 });
    }

    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post("/getsublist", finduser, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    return res.json({ success: true, sublist: user.subcribtion.sublist });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.post("/getsubpack", finduser, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    return res.json({
      success: true,
      subDate: user.subcribtion.subDate,
      expDate: user.subcribtion.expDate,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

module.exports = router;
