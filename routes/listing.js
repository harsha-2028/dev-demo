const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing, saveRedirectUrl} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage });

//Index Route and Create Route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,saveRedirectUrl,validateListing,
   upload.single('Listing[image][url]'),
  wrapAsync(listingController.createListing)
);


//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Show Update And Delete Route
router.
route("/:id")
.get(validateListing,
    wrapAsync(listingController.showListing))
.put(isLoggedIn,saveRedirectUrl, isOwner,validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,
    wrapAsync(listingController.deleteListing));


//Edit route
router.get("/:id/edit",
    validateListing, 
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router; 