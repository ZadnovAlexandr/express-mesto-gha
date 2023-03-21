const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => {
    console.log("DataBase connected");
  })
  .catch((err) => {
    console.log(`Error dataBase ${err}`);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "64197439d48b6c315a4329c9",
  };

  next();
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Connection on the port ${PORT}`);
});
