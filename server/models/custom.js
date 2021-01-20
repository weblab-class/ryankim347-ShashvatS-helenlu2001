const mongoose = require("mongoose");

const CustomMapSchema = new mongoose.Schema({
  creatorID: String,
  width: Number,
  height: Number,
  x: [Number],
  y: [Number],
  public: Boolean
})

module.exports = mongoose.model("custommap", CustomMapSchema);
