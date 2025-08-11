const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//SIGNUP - Route 
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

//LOGIN - Route
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), //invokes req.login() automatically
        userController.login
    );

//lOGOUT - Route
router.post("/logout", userController.logout);

module.exports = router;