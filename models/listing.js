const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//constructing schema
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        filename : String,
        url : String,
        // type : String,
        // default : "https://images.unsplash.com/photo-1742197143486-d6c7d146fbc3?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // when image doesn't even exist
        // set : (v) => v === "" ? "https://images.unsplash.com/photo-1742197143486-d6c7d146fbc3?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    }, // when image is empty.
    //v value is the value entered by the user.
    price : Number,
    location : String,
    country : String,
});

//making a model for that schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;