import express from "express";
import connection from "./db/db.js";
import Listing from "./models/listing.model.js";
import dotenv from "dotenv";
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import wrapAsync from "./utils/wrapAsync.js";
import CustomError from "./utils/CustomError.js";
import Review from "./models/review.model.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static("public"))

//Home page
app.get("/", (req, res) => {
  res.send("Home page");
});

//all listing
app.get("/listings",  wrapAsync(async (req, res) => {
    const data = await Listing.find();
    console.log("api is live");
    res.render("index.ejs", { data });
}));

// take data to add new place (new/route)
app.get("/listings/new",(req, res) => {
  res.render("new.ejs");
});

//add place to the listings
app.post("/listings", wrapAsync(async (req, res, next) => {
    const {title, description, price, location, country, image} = req.body
    const newListing = new Listing({
      title: title,
      description: description,
      price: price,
      location: location,
      country: country,
      image: image
    });

    const savedListing = await newListing.save();
    console.log("saved : ", savedListing);
    res.redirect("/listings");
}));

// specific listing
app.get("/listings/:id",  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    console.log("data fetched", data.title);
    res.render("show.ejs", { data });
}));

//get listing to edit 
app.get("/listings/:id/edit",  wrapAsync(async (req, res) => {
        const {id} = req.params;
        console.log(id);
        
        const listing = await Listing.findById(id)
        console.log(listing);
        res.render("edit.ejs", {listing})
}))

// update listing 
app.patch("/listings/:id", wrapAsync( async(req, res) =>{
        const {id} = req.params
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        console.log("one place edited");
        
        res.redirect("/listings")
    
}))

// delete listing
app.delete("/listings/:id", wrapAsync( async(req, res) =>{
        const {id} = req.params
        await Listing.findByIdAndDelete(id,{...req.body.listing});
        res.redirect("/listings")
        console.log("deleted");
}))

// Review post route 
app.post("/listings/:id/reviews", async(req, res) =>{
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review)

  listing.reviews.push(newReview)

  await newReview.save()
  await listing.save()
  res.redirect("/listings")
  console.log("Review Submitted", newReview);
  console.log(listing._id);
  
})

//for all the routs handle error
app.all("*", (req, res, next) =>{
  next(new CustomError(404, "page not found!"))
})

// middleware 
app.use((err, req, res, next) =>{
  let {status= 500, message ="Something went wrong?" } = err;
  console.error("Something went wrong!");
  res.render("error.ejs", {message, status})
  // res.status(status).send(message)
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
