require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const SendMail = require('../SendMail');
const passport = require("passport");


// generate token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, `${process.env.JWT_SECRET_KEY}`);
};

// hashing using bcrypt
const hashing = async (password, salt) => {
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

// register user
const userRegister = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (password !== confirmPassword) {
        let detail = { "detail": "pasword and confirm password must be same" };
        res.send(detail);
    } else {
        const salt = 10;
        let hash = await hashing(password, salt);
        hash = String(hash);
        if (!user) {
            // const setdata = req.body;
            const data = User({ firstName: firstName, lastName: lastName, email: email, password: hash });
            await data.save();
            delete data._doc.password;
            res.send(data);
        } else {
            let detail = { "detail": "user already register" };
            res.send(detail);
        }
    }
}

// login
const loginUser = (async (req, res) => {
    const { email, password } = req.body;
    const data = await User.findOne({ email: email });
    if (!req.user.Detail) {
        if (data) {
            const id = data.id;
            let token = generateAccessToken(data._id);
            delete data._doc.password;
            res.json({ ...data._doc, token });
        } else {
            let detail = { "detail": "unauthenticated user" };
            res.send(detail);
        }
    } else {
        res.send(req.user);
    }
});

// forgot password link generate to reset password
const resetPasswordLink = (async (req, res) => {
    let { email } = req.body;
    let data = await User.findOne({ email });
    if (data) {
        let code = `<a href="http://localhost:5000/api/resetPassword/?email=${data.email}">Click to reset password</a>`
        SendMail.sendMail(email, code, data.firstName);
        let detail = { 'detail': 'reset link is generated please check your mail' };
        res.send(detail);
    } else {
        let detail = { 'detail': 'unauthenticated user or user not find' };
        res.send(detail);
    }
})


// request for the reset password
const resetPasword = (async (req, res) => {
    let email = req.query.email;
    let { password, repassword } = req.body;
    let data = await User.findOne({ email });
    if (data) {
        if (password === repassword) {
            let salt = 10;
            repassword = String(repassword)
            let hash = await hashing(repassword, salt);
            password = String(hash);
            let data = await User.findOneAndUpdate({ email: email }, { $set: { password: password } })
            if (data) {
                let code = "Sucessfully updated your password";
                await SendMail.sendMail(email, code, data.firstName);
                let token = generateAccessToken(data._id);
                delete data._doc.password;
                res.send({ ...data._doc, token })
            }
            else {
                let detail = { 'detail': 'unauthenticated user or user not found' };
                res.send(detail)
            }
        } else {
            let detail = { 'detail': 'password and repeat password must be equal' };
            res.send(detail);
        }
    } else {
        let detail = { 'detail': 'unauthenticated user or user not find' };
        res.send(detail);
    }
})


// getAll the userdetail
const getTheUser = (async (req, res) => {
    const id = req.body.id;
    if (id) {
        const data = await User.findOne({ _id: id });
        if (data) {
            delete data._doc.password;
            res.send(data);
        } else {
            let detail = { "detail": "User not found" }
            res.send(detail);
        }
    } else {
        let detail = { "detail": "user not found" };
        res.send(detail);
    }
})

// update userPassword
const updateUserPassword = (async (req, res) => {
    const { password, newPassword } = req.body;
    const id = req.body.id;
    if (id) {
        const user = await User.findOne({ _id: id });
        const salt = 10;
        let hash = await hashing(newPassword, salt);
        const passwordValidate = await bcrypt.compare(password, user.password);
        if (passwordValidate) {
            const data = await User.findOneAndUpdate({ _id: id }, { $set: { password: hash } });
            delete data._doc.password;
            res.json(data);
        } else {
            let detail = { "detail": "user name and password does not match" };
            res.send(detail);
        }
    } else {
        let detail = { "detail": "user not found" };
        res.send(detail);
    }
})


// delete account
const deleteUser = (async (req, res) => {
    const { password } = req.body;
    const id = req.body.id;
    if (id) {
        const data = await User.findOne({ _id: id });
        if (data) {
            const passwordValidate = await bcrypt.compare(password, data.password);
            if (passwordValidate) {
                let detail = { "detail": "password does not match" };
                res.send(detail);
            } else {
                const user = await User.findOneAndDelete({ _id: id });
                delete user._doc.password;
                res.json(user);
            }
        } else {
            let detail = { "detail": "user not found" };
            res.send(detail);
        }
    } else {
        let detail = { "detail": "user not found" };
        res.send(detail);
    }
})


// update user profile
const updateProfile = (async (req, res) => {
    const id = req.body.id;
    if (id) {
        const data = await User.findOne({ _id: id });
        if (data) {
            const updateData = req.body;
            const user = await User.findByIdAndUpdate({ _id: id }, updateData);
            res.json(user);
        } else {
            let detail = { "detail": "user not found" };
            res.send(detail);
        }
    }
})

module.exports = {
    userRegister,
    loginUser,
    resetPasswordLink,
    resetPasword,
    getTheUser,
    updateUserPassword,
    deleteUser,
    updateProfile
};