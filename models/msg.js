const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema({
  content: String,
  userId: String
});

module.exports = mongoose.model("Msg", msgSchema);
