const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


//Render Signup Form and SignIn
router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync (userController.SignIn));

//Render LogeIn Page And Login 
router
.route("/login")
.get(userController.renderLoginPage)
.post( saveRedirectUrl,
    passport.authenticate("local",
         { failureRedirect: '/login',
            failureFlash : true,
         }),
         userController.logIn
    );

//User Logout
router.get("/logout",userController.logOut);

module.exports = router;