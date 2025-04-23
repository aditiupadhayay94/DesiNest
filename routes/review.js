const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../Utils/WrapAsync");
const ExpressError = require("../Utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review"); // ✅ You forgot to require this
const { reviewSchema } = require("../Schema");
const { isLoggedIn,isReviewAuthor } = require("../Middleware.js");
const reviewController = require("../controllers/reviews.js");

// Middleware to validate review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};

// ✅ POST - Create review
router.post("/",isLoggedIn,validateReview, WrapAsync(reviewController.createReview));

// ✅ DELETE - Delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewController.destroyReview));

module.exports = router;
