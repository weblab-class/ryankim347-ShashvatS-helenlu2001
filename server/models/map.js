const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema({
  id: Number,
  x: [Number],
  y: [Number]
})

module.exports = mongoose.model("map", MapSchema);
