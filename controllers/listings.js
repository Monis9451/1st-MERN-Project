const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listing/index", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render('listing/new.ejs')
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listData = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listData) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    }
    res.render("listing/show", { listData })
}

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    }
    res.render("listing/edit", { data });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Successfully updated the existing listing");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted an existing listing");
    res.redirect("/listing");
}