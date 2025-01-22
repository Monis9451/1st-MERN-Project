const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
};
main().then(()=>{console.log("Connection successfull")}).catch((err)=>{console.log(`Following error is occurring in connection: ${err}`)});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "678a5b9ff5954a2581ca8bc4" }))
    initData.data = initData.data.map((listing)=>{
        listing.image = listing.image===""? "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":listing.image;
        return listing;
    });
    await Listing.insertMany(initData.data);
    console.log("Data is initialized");
}

initDB();