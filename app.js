
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
console.log("Views path is:", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

//Index Route 
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
        title: "Add New Listing"
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
    try {
        const defaultImageUrl = "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

        const listingData = req.body.listing;

        // Validate required fields manually
        const requiredFields = ['title', 'description', 'price', 'country', 'location'];
        for (const field of requiredFields) {
            if (!listingData[field] || listingData[field].toString().trim() === '') {
                return res.status(400).send(`Error: "${field}" is required.`);
            }
        }

        // Assign default image if none is provided
        if (!listingData.image || listingData.image.trim() === '') {
            listingData.image = {
                filename: "listingimage",
                url: defaultImageUrl
            };
            console.log("📸 Default image assigned in CREATE:", listingData.image.url);
        } else {
            // If image URL is provided, format it properly
            listingData.image = {
                filename: "listingimage",
                url: listingData.image
            };
        }

        // Convert price to number
        listingData.price = Number(listingData.price);

        const newListing = new Listing(listingData);
        await newListing.save();

        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

//Update : Edit & Update Route
app.get("/listings/:id/edit",async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {
        listing,
        title: "Edit Listing"
    });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listingData = req.body.listing;
        const defaultImageUrl = "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

        // Validate required fields
        const requiredFields = ['title', 'description', 'price', 'country', 'location'];
        for (const field of requiredFields) {
            if (!listingData[field] || listingData[field].toString().trim() === '') {
                return res.status(400).send(`Error: "${field}" is required.`);
            }
        }

        // Handle image assignment - assign default if empty
        if (!listingData.image || listingData.image.trim() === '') {
            listingData.image = {
                filename: "listingimage",
                url: defaultImageUrl
            };
            console.log("📸 Default image assigned in UPDATE:", listingData.image.url);
        } else {
            // If image URL is provided, format it properly
            listingData.image = {
                filename: "listingimage",
                url: listingData.image
            };
        }

        // Convert price to number
        listingData.price = Number(listingData.price);

        await Listing.findByIdAndUpdate(id, listingData);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            return res.status(404).send("Listing not found or already deleted");
        }

        console.log("Deleted:", deletedListing.title);
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});