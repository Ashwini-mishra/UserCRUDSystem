const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = mongoose.model(
  "users",
  new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: Number, default: 1 }
  },{timestamps: true})
);

module.exports = User;