const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userAuth", {
    useNewUrlParser: true,
}).then((_) => console.log("Connected to User DB"))
    .catch((err) => console.error("error", err));

module.exports = mongoose;