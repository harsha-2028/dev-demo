const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});


const initDB = async()=>{
    await Listing.deleteMany();
   initdata.data = initdata.data.map((obj)=>({...obj,
         owner:"6abfe9fa1549a85022977632"
        }));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialize");
};
 
initDB();


// const schema = new mongoose.Schema;


// const Listing = new Schema({
//     title :{
//         type : String,
//         required : true,
//     }
// })