const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//Reviews
//Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new review");
    res.redirect(`/listing/${req.params.id}`);
}))

//Delete route
router.delete("/:reviewId",isReviewAuthor ,wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted an existing review");
    res.redirect(`/listing/${id}`);
}))

module.exports = router;
