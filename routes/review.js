const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")

//Review validate function
const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
//Reviews
//Post route
router.post("/", validateReview, wrapAsync(async(req, res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new review");
    res.redirect(`/listing/${req.params.id}`);
}))

//Delete route
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted an existing review");
    res.redirect(`/listing/${id}`);
}))

module.exports = router;
