const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../Middleware.js");
const userController = require("../controllers/users.js");



router.route("/signup")
.get(userController.renderSignupForm)
.post(WrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate("local",{failureRedirect:`/login`,failureflash:true}),userController.login);


// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", WrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm);
// router.post("/login",passport.authenticate("local",{failureRedirect:`/login`,failureflash:true}),userController.login);

router.get("/logout",userController.logout);


module.exports = router;
