const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js")

async function main(){
    await mongoose.connect(MONGO_URL);
};
main().then(()=>{console.log("Connection successfull")}).catch((err)=>{console.log(`Following error is occurring in connection: ${err}`)});

app.listen(port, ()=>{
    console.log("Port 8080 is listening");
});

app.get("/", (req, res)=>{
    res.send("Hey, I'm root!");
});

app.get("/listing", async(req, res)=>{
    let allListings = await Listing.find().then((res)=>{console.log(res)});
    res.render(index.ejs, {allListings})
})

// app.get("/testListing", async(req, res)=>{
//     await Listing.create({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Okara, Punjab",
//         country:"Pakistan"
//     })
//     .then((res)=>{console.log(res)})
//     res.send("Testing successfull")
// });