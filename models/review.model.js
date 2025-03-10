import mongoose from "mongoose";

// Define the review schema
const reviewSchema = mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema);

export default Review;


// // Add a new review
// let addReview = async () => {
//     try {
//         let review = new Review({
//             comment: "good place to visit",
//             rating: 4
//         });

//         // Save the review to the database
//         await review.save();

//         console.log("Review added:", review);
//     } catch (error) {
//         console.error("Error adding review:", error);
//     }
// };

// Call the addReview function
// addReview();