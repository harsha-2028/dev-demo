const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.SignIn= async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser =  new User({email , username});
        const registerdUser =  await User.register(newUser,password);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
           req.flash("success","user was registered successfully");
           res.redirect("/listing");
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    };
};

module.exports.renderLoginPage = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.logIn=  async (req,res)=>{
            req.flash("success","Welcome back to wanderLust ");
            let redirectUrl = res.locals.redirectUrl || "/listing"
            res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","You are logged out now !");
        res.redirect("/listing");
    });
};