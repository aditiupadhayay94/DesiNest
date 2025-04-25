 const Listing = require("../models/listing");
 const ExpressError = require("../Utils/ExpressError");
 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 const mapToken = process.env.MAP_TOKEN;
 const geocodingClient = mbxGeocoding({ accessToken:mapToken });
 
 module.exports.index = async (req, res) => {
  const { search } = req.query;
  let allListing;

  if (search) {
    allListing = await Listing.find({
      $or: [
        { title: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
      ]
    });
  } else {
    allListing = await Listing.find({});
  }

  res.render("listings/index", { allListing });
}


  module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if (!listing) throw new ExpressError("Listing not found", 404);
    res.render("listings/show", { listing });
  }

  module.exports.createListing =async (req, res, next) => {
      let response = await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1
      })
       .send()

      console.log(response.body.features[0].geometry); 
      

      let url=req.file.path;
      let filename = req.file.filename;
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url,filename}; 
      newListing.geometry = response.body.features[0].geometry; 
      let savedListing=await newListing.save();
      console.log(savedListing);
      req.flash("success","New listing created!");
      res.redirect("/listings");
  }

  module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    } 
    let OriginalImageUrl=listing.image.url;
    OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit", { listing,OriginalImageUrl });
  }

  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    // If location is updated get new coordinates using Mapbox geocoding
    if (updatedData.location) {
        let response = await geocodingClient.forwardGeocode({
            query: updatedData.location,
            limit: 1
        }).send();

        if (response.body.features.length > 0) {
            updatedData.geometry = response.body.features[0].geometry; // Update geometry (coordinates)
        }
    }

    // Update the listing with the new data
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });

    // Handle image upload if new image is provided
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
    }

    await updatedListing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${updatedListing._id}`);
}


  module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  }