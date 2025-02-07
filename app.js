if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const reviewsRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.urlencoded({ extended: true }));

const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Root
// app.get("/", (req, res)=>{
//     res.send("Hey, I'm root!");
// });

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

async function main(){
    await mongoose.connect(MONGO_URL);
};
main().then(()=>{console.log("Connection successfull")}).catch((err)=>{console.log(`Following error is occurring in connection: ${err}`)});


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
})

// Server error handler
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("listing/error",{err})
})

app.listen(port, ()=>{
    console.log("Port 8080 is listening");
});