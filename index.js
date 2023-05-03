const express = require("express");
const mongoose = require("mongoose");
const BrandName = require("./model/model");
const createUserDetails = require("./login/login");
const multer = require("multer");
const fs = require("fs");
const app = express();
app.use(express.json()); // mididle ware

mongoose
  .connect(
    "mongodb+srv://mernapi:mernapi2022@cluster1.iahl2gn.mongodb.net/test"
  )
  .then(() => {
    console.log("db had connceted newly.....!!!!!");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/", (req, res) => {
  res.send("Hello hari");
});

app.get("/login", (req, res) => {
  res.send("login page");
});
app.post("/addbrands", async (req, res) => {
  const { brandname } = req.body;
  try {
    const newData = new BrandName({ brandname });
    await newData.save();
    return res.json(await BrandName.find());
  } catch (err) {
    console.log(err);
  }
});

// get all items
app.get("/getallbrands", async (req, res) => {
  try {
    const allData = await BrandName.find();
    return res.json(allData);
  } catch (err) {
    console.log(err);
  }
});

// get by single item
app.get("/getallbrands/:id", async (req, res) => {
  try {
    const Data = await BrandName.findById(req.params.id);
    return res.json(Data);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/deletebrand/:id", async (req, res) => {
  try {
    await BrandName.findByIdAndDelete(req.params.id);
    return res.json(await BrandName.find());
  } catch (err) {
    console.log(err);
  }
});

app.put("/editbrand/:id", async (req, res) => {
  try {
    const updatedBrand = await BrandName.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json(updatedBrand);
  } catch (err) {
    console.log(err);
  }
});

// login operations
//post method
app.post("/createuser", async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  try {
    const newUserData = new createUserDetails({ email, password });
    await newUserData.save();
    const checkOutput = res.json(await createUserDetails.find());
    delete checkOutput.email;
    delete checkOutput.password;
  } catch (err) {
    console.log(err);
  }
});

//get method
app.get("/getusers", async (req, res) => {
  try {
    const getAllUsersData = await createUserDetails.find();
    return res.json(getAllUsersData);
  } catch (err) {
    console.log(err);
  }
});

//get user by id
app.get("/getusers/:id", async (req, res) => {
  try {
    const getUsersData = await createUserDetails.findById(req.params.id);
    return res.json(getUsersData);
  } catch (err) {
    console.log(err);
  }
});

// put method
app.put("/edituser/:id", async (req, res) => {
  try {
    const updateUserDetails = await createUserDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json(updateUserDetails);
  } catch (err) {
    console.log(err);
  }
});

// delete method
app.delete("/deleteuser/:id", async (req, res) => {
  try {
    await createUserDetails.findByIdAndDelete(req.params.id);
    return res.json(await createUserDetails.find());
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => console.log("server running............"));
app.listen(5000, () => console.log("login server running.............."));
// file upload code
const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    if (!fs.existsSync(__dirname + "/temp")) {
      fs.mkdirSync(__dirname + "/temp");
    }
    callBack(null, "/.temp");
  },
  filename: function (req, file, callBack) {
    callBack(
      null,
      file.filename + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const upload = multer(storage);
app.get("/upload", upload.single("file"), async (req, res) => {
  console.log("file", req.file);
  res.json({ status: "ok file upladed successfully", data: req.file });
});
