import Review from "../models/review.model.js";
async function isReviewAuthor(req, res, next) {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You have no Permission to delete this review.");
    return res.redirect(`/listings/${id}`);
  }
  next()
}

export default isReviewAuthor