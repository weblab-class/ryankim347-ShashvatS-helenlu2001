const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  photo: String,
  googleid: String,
  games: Number,
  points: Number,
  deaths: Number,
  wins: Number,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
