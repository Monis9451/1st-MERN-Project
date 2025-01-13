const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js")
const Review = require("./models/review.js");
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")
const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))
app.use("/listing", listing);
app.use("/listing/:id/reviews", reviews);

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

async function main(){
    await mongoose.connect(MONGO_URL);
};
main().then(()=>{console.log("Connection successfull")}).catch((err)=>{console.log(`Following error is occurring in connection: ${err}`)});


//Root
app.get("/", (req, res)=>{
    res.send("Hey, I'm root!");
});

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
})

// Server error handler
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("listing/error",{err})
    // res.status(statusCode).send(message);
})

// app.get("/testListing", async(req, res)=>{
//     await Listing.create({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Okara, Punjab",
//         country:"Pakistan"
//     })
//     .then((res)=>{console.log(res)})
//     res.send("Testing successfull")
// });'

app.listen(port, ()=>{
    console.log("Port 8080 is listening");
});