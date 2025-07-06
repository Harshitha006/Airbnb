const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function cleanInvalidListings() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB for cleanup ✅");

    // Define criteria for bad listings
    const deleted = await Listing.deleteMany({
        $or: [
            { title: { $in: [null, ""] } },
            { description: { $in: [null, ""] } },
            { price: { $in: [null, ""] } },
            { location: { $in: [null, ""] } },
            { country: { $in: [null, ""] } }
        ]
    });

    console.log(`Deleted ${deleted.deletedCount} invalid listings 🚮`);
    mongoose.connection.close();
}

cleanInvalidListings().catch(err => {
    console.error("Error during cleanup:", err);
});
