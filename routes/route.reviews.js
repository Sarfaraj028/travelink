import { Router } from "express"
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.model.js";
import Review from "../models/review.model.js";
import { isLogedIn } from "../middleware/isLogedIn.js";
import isReviewAuthor from "../middleware/isReviewAuthor.js";

const reviewsRouter = Router({mergeParams: true})


//delete review
reviewsRouter.delete("/:reviewId", isLogedIn, isReviewAuthor, wrapAsync( async(req, res) =>{
    let {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    req.flash("success", "Review deleted successfully!")
    res.redirect(`/listings/${id}`)
  }))
  
  // Review post route 
  reviewsRouter.post("/", isLogedIn, async(req, res) =>{
    let {id} = req.params
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    console.log(newReview.author);
    
    listing.reviews.push(newReview)
  
    await newReview.save()
    await listing.save()
    console.log("Review Submitted", newReview);
    console.log(listing._id);
    req.flash("success", "New Review added!")
    res.redirect(`/listings/${id}`)
    
  })

  export default reviewsRouter