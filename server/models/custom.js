const mongoose = require("mongoose");

const CustomMapSchema = new mongoose.Schema({
  creatorID: String,
  creatorName: String,
  name: String,
  width: Number,
  height: Number,
  x: [Number],
  y: [Number],
  mx: [Number],
  my: [Number],
  public: Boolean
})

module.exports = mongoose.model("custommap", CustomMapSchema);
