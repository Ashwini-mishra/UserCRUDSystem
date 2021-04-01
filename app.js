const express = require("express");
require("dotenv").config();
const mongoose = require("./config/db");
const user = require("./routes/userRoutes");
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');


app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/",user);

app.listen(5000, () => { console.log("working on port 5000") });
