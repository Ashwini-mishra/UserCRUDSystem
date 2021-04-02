const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = mongoose.model(
  "users",
  new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true ,match:/^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: Number, default: 1, enum: [1, 2, 3] }
  }, { timestamps: true })
);

module.exports = User;