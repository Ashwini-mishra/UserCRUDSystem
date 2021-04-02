const router = require("express").Router();
const user = require('../controllers/userController');
const passport = require('../middleware/auth');
require("dotenv").config();

router.post("/registerUser",passport.userValidate, user.userRegister);
router.post('/loginUser',passport.userLoginValidate, passport.userPassport.authenticate("local"), user.loginUser);
router.post('/forgotPassword',user.resetPasswordLink);
router.post('/resetPassword',passport.userPasswordValidate ,user.resetPasword);
router.get('/getUserDetail',passport.authenticate,user.getTheUser);
router.put('/updatePassword',passport.authenticate,user.updateUserPassword);
router.delete('/deleteUser',passport.authenticate,user.deleteUser);
router.put('/updateProfile',passport.authenticate,user.updateProfile);

module.exports = router;