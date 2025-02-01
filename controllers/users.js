const User = require("../models/user.js");
const user = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.renderSignup = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = ({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listing");
        });
    }
    catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.renderProfile =  async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectURL = req.session.redirectURL || "/listing";
    res.redirect(redirectURL);
}

module.exports.renderLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listing");
    });
}