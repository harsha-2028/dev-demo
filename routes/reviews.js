const express = require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
// Post Review Routes 
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)); 

// Delete review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deletereview));

//exporting this file 
module.exports = router;