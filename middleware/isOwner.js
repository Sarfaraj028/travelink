import Listing from "../models/listing.model.js";
async function isOwner(req, res, next) {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You have no Permission to update this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next()
}

export default isOwner