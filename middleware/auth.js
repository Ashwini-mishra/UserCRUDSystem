const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");


// middleware to authenticate the user
passport.serializeUser(function (user, done) {
    done(null, user);
})
passport.deserializeUser(function (id, done) {
    done(null, '');

});

// passport validation
const userPassport = passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    async (done, userName, password, next) => {
        const salt = 10;
        // const pass = await hashing(password, salt);

        try {
            User.findOne({ email: userName }, async (err, user) => {
                if(user)
                {
                    const passwordValidate = await bcrypt.compare(password, user.password);
                    if (err) { return console.log(err) }
                    if (!user) {
                        let detail = { "Detail": "Unauthorised User" };
                        return next(null, detail);
                    }
                    if (!passwordValidate) {
                        let detail = { "Detail": "password not matched" };
                        return next(null, detail);
                    }
                    return next(null, user.email);
                }else{
                    let detail={"detail":"user not found"};
                    return next(null, detail);
                }
             
            });
        } catch (error) {
            console.log("error occure", error.message)
        }
    }
));

// jwt authentication
const authenticate = (req, res, next) => {
    try {
        const decoded = jwt.verify(
            // requesting the token from the header to authenticate
            req.headers.authorization,
            process.env.JWT_SECRET_KEY
        );
        if (decoded) {
            const data = User.findOne({ _id: decoded.id });
            if (data) {
                req.body.id = data._conditions._id;
                next();
            } else {
                res.send("only admin have the permission to access");
            }
        } else {
            return res.send("Unauthenticated User");
        }

    } catch (err) {
        return res.send(err.message);
    }
}


module.exports = { userPassport, authenticate };