const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  photo: String,
  googleid: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
