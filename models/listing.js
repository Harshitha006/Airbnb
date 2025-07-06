const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImageUrl = "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

//constructing schema
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        filename : {
            type: String,
            default: "listingimage"
        },
        url : {
            type: String,
            default: defaultImageUrl,
            set: (v) => v === "" || v === null || v === undefined ? defaultImageUrl : v
        }
    },
    price : Number,
    location : String,
    country : String,
});

//making a model for that schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
