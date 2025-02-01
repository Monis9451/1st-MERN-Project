const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectURL } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectURL, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.renderProfile);

router.get("/logout", userController.renderLogout);

module.exports = router;