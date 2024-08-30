const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))

async function main(){
    await mongoose.connect(MONGO_URL);
};
main().then(()=>{console.log("Connection successfull")}).catch((err)=>{console.log(`Following error is occurring in connection: ${err}`)});

//Root
app.get("/", (req, res)=>{
    res.send("Hey, I'm root!");
});

//Index route
app.get("/listing", wrapAsync(async(req, res)=>{
    let allListings = await Listing.find();
    res.render("listing/index", {allListings})
}))

//New route
app.get("/listing/new", (req, res)=>{
    res.render('listing/new.ejs')
})

//Show route
app.get("/listing/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listData = await Listing.findById(id);
    res.render("listing/show",{listData})
}))

//Create route
    app.post("/listing",wrapAsync(async(req, res, next)=>{
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid Data for listing")
        }
            await Listing.create(req.body.listing);
            res.redirect("/listing");
    }))

//Edit route
app.get("/listing/:id/edit", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("listing/edit", {data});
}))

//Update route
app.patch("/listing/:id", wrapAsync(async(req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid Data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listing/${id}`);
}))

//Delete route
app.delete("/listing/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}))

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