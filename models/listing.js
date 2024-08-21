const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=> v===""? "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:{
        type:Number
    },
    country:{
        type:String
    },
    location:{
        type:String
    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing