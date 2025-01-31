const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be signed in to create a new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
        let {id} = req.params;
        let listing = await Listing.findById(id)
        if(!listing.owner.equals(res.locals.currentUser._id)){
            req.flash("error", "You do not have permission to update this listing");
            res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}