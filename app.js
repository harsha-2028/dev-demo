if(process.env.NODE_ENV!= "production"){
    require('dotenv').config()
}
// or import 'dotenv/config' // for esm
const express = require('express');
const app = express();  
const mongoose = require('mongoose')
const port = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError= require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStatergy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter= require("./routes/user.js");
const dburl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl : dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:60*60*24
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err)
});

const sessionOption = {
    store :store,
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
};
// app.get("/",(req,res)=>{
//     res.send("Root Directory !");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//establising connection to mongo db
async function main() {
    await mongoose.connect(dburl); 
}

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




//Listing Route 
app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("/*splat",(req,res,next)=>{
    next(new expressError(404,"page not found !"));
});
app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "something went wrong !"} = err;
    res.status(statusCode).render("error.ejs",{err})
    // res.status(statusCode).send(message);
});

//starting of server
app.listen(port,()=>{
    console.log(`Server is listening to port ${port}`);
});
 

// app.get("/testListing", async(req,res) =>{
//     let sampleListing = newListing({
//         title : "My new villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute , Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was Saved !");
//     res.send("successful testing");
// });


// // app.get("/demo",async (req,res)=>{
// //     let fakeUser = new User({
// //         email : "student@gmail.com",
// //         username : "Harsha",
// //     });

//    let registeredUser = await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// }); 