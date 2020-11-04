const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
  },
  mimetype: String,
});

module.exports = fileSchema;
