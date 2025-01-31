const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Index route
router.get("/", wrapAsync(async(req, res)=>{
    let allListings = await Listing.find();
    res.render("listing/index", {allListings})
}))

//New route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render('listing/new.ejs')
})

//Show route
router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listData = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listData){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listing");
    }
    res.render("listing/show",{listData})
}))


//Create route
router.post("/", validateListing, isLoggedIn, wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listing");
}))

//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req, res)=>{
let {id} = req.params;
let data = await Listing.findById(id);
if(!data){
req.flash("error", "Listing you requested for does not exist");
res.redirect("/listing");
}
res.render("listing/edit", {data});
}))

//Update route
router.patch("/:id", isLoggedIn, wrapAsync(async(req, res)=>{
let {id} = req.params;
await Listing.findByIdAndUpdate(id, req.body.listing);
req.flash("success", "Successfully updated the existing listing");
res.redirect(`/listing/${id}`);
}))

//Delete route
router.delete("/:id", isLoggedIn, wrapAsync(async(req, res)=>{
let {id} = req.params;
await Listing.findByIdAndDelete(id);
req.flash("success", "Successfully Deleted an existing listing");
res.redirect("/listing");
}))

module.exports = router;