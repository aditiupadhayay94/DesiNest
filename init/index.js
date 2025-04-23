const mongoose = require("mongoose");
const initData = require("./data.js"); // adjust path if needed
// const path = require("path");
// const Listing = require(path.join(__dirname, "../models/listing.js"));
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connection successfull")
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb = async () => {
    await Listing.deleteMany({});
    const newData = initData.data.map((obj) => ({
        ...obj,
        owner: "67fb82151891ac38cb486d06"
    }));
    await Listing.insertMany(newData);
    console.log("data was initialized");
};


initDb();