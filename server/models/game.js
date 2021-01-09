const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  code: String,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
