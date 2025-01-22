const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectURL } = require("../middleware.js");

router.get("/signup", (req, res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res)=>{
    try{
        let {email, username, password} = req.body;
        const newUser = ({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listing");
        });
    }
    catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectURL, passport.authenticate("local", {failureRedirect:'/login', failureFlash: true}), async(req, res)=>{
    req.flash("success", "Welcome back!");
    let redirectURL = req.session.redirectURL || "/listing";
    res.redirect(redirectURL);
});

router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listing");
    });
});

module.exports = router;