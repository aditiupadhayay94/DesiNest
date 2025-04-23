const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync");
const {listingSchema, reviewSchema} = require("../Schema.js");
const ExpressError = require("../Utils/ExpressError");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner} = require("../Middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});



const validateListing = (req,res,next) =>{
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(msg, 400)); 
    }else{
      next();
    }
  }
  router.route("/")
    .get( WrapAsync(listingControllers.index))
    .post(isLoggedIn,validateListing, upload.single('listing[image]'),WrapAsync(listingControllers.createListing));
  

//New Route
// New Route with authentication check
router.get("/new", isLoggedIn,listingControllers.renderNewForm);


router.route("/:id")
.get( WrapAsync(listingControllers.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, WrapAsync(listingControllers.updateListing))
.delete(isLoggedIn,isOwner, WrapAsync(listingControllers.destroyListing));

// INDEX - All Listings
// router.get("/", WrapAsync(listingControllers.index));
// // CREATE - Save new listing
// router.post("/",validateListing, WrapAsync(listingControllers.createListing));
// SHOW - Show individual listing
// router.get("/:id", WrapAsync(listingControllers.showListing));

// EDIT - Edit form
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(listingControllers.editListing));

// UPDATE - Update listing
// router.put("/:id",isLoggedIn,isOwner,validateListing, WrapAsync(listingControllers.updateListing));

// DELETE - Remove listing
// router.delete("/:id",isLoggedIn,isOwner, WrapAsync(listingControllers.destroyListing));
  


module.exports = router;