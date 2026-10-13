const Listing = require("./models/listing.js");
const expressError= require("./utils/expressError.js");
const{listingSchema ,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect URL
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Login To make Changes");
        return res.redirect("/login");
    }
    next();
} 


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.currUser._id)){
       req.flash("error","You dont have permission to edit !");
       return  res.redirect(`/listing/${id}`);
    }
    next();
}

//Validate Listing  Server Side !!!
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new expressError(400,error);
    }else{
        next();
    }
}


//validate Reviews !!!!
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) =>el.message).join(",");
        throw new expressError(400,error);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id ,reviewId} = req.params;
    let review = await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
       req.flash("error","You are not have permission change this review !!!");
       return  res.redirect(`/listing/${id}`);
    }
    next();
}