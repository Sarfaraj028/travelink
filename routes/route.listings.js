import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.model.js";
import Review from "../models/review.model.js";
import { isLogedIn } from "../middleware/isLogedIn.js";

const router = Router();

//all listing
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const data = await Listing.find();
    console.log("api is live");
    res.render("index.ejs", { data });
  })
);

// take data to add new place (new/route)
router.get("/new", isLogedIn,(req, res) => {
  res.render("new.ejs");
});

//add place to the listings
router.post(
  "/",
  isLogedIn,
  wrapAsync(async (req, res, next) => {
    const { title, description, price, location, country, image } = req.body;
    const newListing = new Listing({
      title: title,
      description: description,
      price: price,
      location: location,
      country: country,
      image: image,
    });
    const savedListing = await newListing.save();
    console.log("saved : ", savedListing);
    req.flash("success", "New Listing added!");
    res.redirect("/listings");
  })
);

// specific listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    if (!data) {
      req.flash("error", "The data you requested for not exist!");
      res.redirect("/listings");
    } else {
      console.log("data fetched", data.title);
      res.render("show.ejs", { data });
    }
  })
);

//get listing to edit
router.get(
  "/:id/edit",
  isLogedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "The data you requested for not exist!");
      res.redirect("/listings");
    }
    else{
      console.log(listing);
      res.render("edit.ejs", { listing });
    }
    
  })
);

// update listing
router.patch(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log("one place edited");
    req.flash("success", `listing Edited`);
    res.redirect("/listings");
  })
);

// delete listing
router.delete(
  "/:id",
  isLogedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id, { ...req.body.listing });
    console.log("deleted");
    req.flash("success", `listing deleted`);
    res.redirect("/listings");
  })
);

export default router;
