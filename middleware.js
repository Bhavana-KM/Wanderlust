const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./utils/schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //save RedirectUrl 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

// storing redirectUrl in req.locals -- 
// bcz after passport.authenticate(), 
// after logging the user passport resets session 
// hence req.session.redirectUrl - undefined (no value stored)
// so store that value in locals before login (passport as no access to locals)

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "Sorry! You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
        
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
       const errMsg = error.details.map(el => el.message).join(",");
       throw new ExpressError(400, errMsg); 
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) =>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if( !review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "Action denied: You can only manage your own reviews.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};