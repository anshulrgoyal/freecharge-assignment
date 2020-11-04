// all the models are in this file

const mongoose = require("mongoose");

const User = require("./user");
const File = require("./file");

module.exports = {
  User: mongoose.model("User", User),
  File: mongoose.model("File", File),
};
