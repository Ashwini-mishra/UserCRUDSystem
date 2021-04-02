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
                if (user) {
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
                } else {
                    let detail = { "detail": "user not found" };
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
                let detail = { "detail": "in valid signature or token" }
                res.send(detail);
            }
        } else {
            let detail={"detail":"Unauthenticated User"}
            return res.send(detail);
        }

    } catch (err) {
        return res.send(err.message);
    }
}
// validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// register user validate
const userValidate = ((req, res, next) => {
    try {
        let message = [];
        let  counter = 0,detail="",name,password,email;
        if (req.body.firstName.length >= 3) {
            counter++;

        } else {
            name =  "your name should be greater then or equal to 3 characters" ;
            detail=({...message,name});
        }
        if (/^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) {
            counter++;
        } else {
            password = "password must contain 8 character,one special character and one upperCase character" ;
            detail=({...message,name,password});
        }
        let validEmail = validateEmail(req.body.email);
        if (validEmail) {
            counter++;
        } else {
            email =  "please enter correct email formate";
            detail=({...message,name,password,email});
        }
        if(counter===3)
        {
            next();
        }else{
            res.send(detail);
        }
    } catch (error) {
        res.send(error.message);
    }
})


// login validation
const userLoginValidate = ((req, res, next) => {
    try {
        let counter=0;
        let message = [],detail="",email,password;
        let validEmail = validateEmail(req.body.email);
        if (validEmail) {
           counter++;
        } else {
            email = "please enter correct email password" ;
            detail=({...message,email});
        }

        if (/^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) {
           counter++;
        } else {
            password ="password must contain 8 character,one special character and one upperCase character" ;
            detail=({...message,password,email});
        }

        if(counter===2)
        {
            next();
        }else{
            res.send(detail)
        }
    } catch (error) {
        res.send(error.message);
    }
})

// user password validation
const userPasswordValidate = ((req, res, next) => {
    try {
        if (/^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) {
            next();
        } else {
            let detail = { "detail": "password must contain 8 character,one special character and one upperCase character" };
            res.send(detail);
        }
    } catch (error) {
        res.send(error.message);
    }
})


module.exports = { userPassport, authenticate, userValidate, userLoginValidate, userPasswordValidate };