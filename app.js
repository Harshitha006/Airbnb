const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const ejsMate = require("ejs-mate");

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
//below order should be maintained! 
// app.engine('ejs',ejsMate);
app.set("view engine","ejs");
// You must register ejs-mate before telling Express to use EJS as the view engine. Otherwise, it defaults to standard EJS — which doesn’t support layout.
app.set("views", path.join(__dirname,"views"));
console.log("Views path is:", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

// app.get("/",(req,res)=>{
//     res.send("Hi,I am root");
// });


//Index Route 
//GET     /listings   =>  returns all list
app.get("/listings",async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {
        allListings,
        title: "All Listings"
    });
});

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new" ,{
        title: "All Listings"
    });
});

//Read : Show Route
app.get("/listings/:id",async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {
        listing,
        title: "Listing Details"
    });
});

//Create Route
app.post("/listings", async (req, res) => {
    const defaultImageUrl = "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const listingData = req.body.listing;

    // Ensure `image` exists, then check if `image.url` is empty
    if (!listingData.image) {
        listingData.image = {};
    }
    if (!listingData.image.url || listingData.image.url.trim() === "") {
        listingData.image.url = defaultImageUrl;
    }

    const newlisting = new Listing(listingData);
    await newlisting.save();
    res.redirect("/listings");
});

// app.post("/listings", async (req,res) => {
//     // let {title,description,price,location} = req.body;
//     const newlisting = new Listing(req.body.listing);
//     await newlisting.save();
//     res.redirect("/listings");
// });


//Update : Edit & Update Route
//GET   /listings/:id/edit  -> edit form -> submit
//PUT   /listings/:id
app.get("/listings/:id/edit",async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {
        listing,
        title: "Edit Listing"
    });
});
//Update Route
app.put("/listings/:id",async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
//DELETE    /listings/:id
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// app.listen(8080,()=>{
//     console.log("Server is listening to port 8080");
// });

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});
// app.post("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         "title": "My New Villa",
//         "description" : "By the beach",
//         "price": 1200,
//         "location": "Calangute, Goa",
//         "country" : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sample was saved");
// });