import mongoose, { Schema, set } from "mongoose";
import Review from "./review.model.js";

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://unsplash.com/photos/aerial-view-of-village-on-mountain-cliff-during-orange-sunset-cYrMQA7a3Wc",
        set: (v) => v ? v : "https://unsplash.com/photos/aerial-view-of-village-on-mountain-cliff-during-orange-sunset-cYrMQA7a3Wc",
    },
    price:{
        type: Number,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    
    country:{
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
})

//mongoose middleware to delete all the attached reviews to a particluar listing
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
        await Review.deleteMany({ _id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema)

export default Listing