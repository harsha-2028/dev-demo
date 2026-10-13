const { response } = require("express");
const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudconfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

//Index CallBack !!
module.exports.index = async (req,res)=>{
   const all_Listing =  await Listing.find({});
   res.render("./listing/index.ejs",{all_Listing});
};

//New Route !!!
module.exports.renderNewForm = (req,res)=>{
    res.render("./listing/new.ejs");
};
 
//create new route 
module.exports.createListing = async(req,res,next)=>{
let response = await geocodingClient.forwardGeocode({
    query: req.body.Listing.location,
    limit: 2
})
    .send()
    let url = req.file.path;
    let filename = req.file.filename;
    // let {title,description,image,price,country,location}  = req.body
    // let listing = req.body.Listing;
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
       let savedListing =  await newListing.save();
        req.flash("success","New Listing Created !");
        res.redirect("/listing");
};

//Edit Form
module.exports.renderEditForm= async (req,res)=>{
     let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for not exist");
        return res.redirect("/listing");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

    res.render("./listing/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing},{runValidators:true});
    req.flash("success","Listing Updated !");
    res.redirect(`/listing/${id}`);
};

//delete listing
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // Delete image from Cloudinary
    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }            
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
};

//show routes 
module.exports.showListing = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",
        populate :
        {path : "author"}
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for not exist");
        return res.redirect("/listing");
    };
    res.render("./listing/show.ejs",{listing});
};