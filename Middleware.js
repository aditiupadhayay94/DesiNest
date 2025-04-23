const Listing = require("./models/listing");
const review = require("./models/review");

  
  
  
  
  
// Middleware.js
function isLoggedIn(req, res, next) {
    // console.log(req.path, ".." ,req.originalUrl)
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash('error', 'You must be logged in');
      return res.redirect('/login');
    }
    next();
  }
  
  module.exports = { isLoggedIn };
  module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  };
  
  module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing || !listing.owner.equals(req.user._id)) {
      req.flash("error", "You are not owner of this listing.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };

  module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let foundReview = await review.findById(reviewId);
    if (!foundReview.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };
  