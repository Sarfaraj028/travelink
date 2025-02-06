import express from "express";
import connection from "./db/db.js";
import Listing from "./models/listing.model.js";
import dotenv from "dotenv";
import methodOverride from "method-override"
import ejsMate from "ejs-mate"

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
app.get("/listings", async (req, res) => {
  try {
    const data = await Listing.find();
    console.log("data fetched first title: ", data[0].title);
    res.render("index.ejs", { data });
  } catch (err) {
    console.error("Data not found : ERROR: ", err);
  }
});

// take data to add new place (new/route)
app.get("/listings/new", async (req, res) => {
  res.render("new.ejs");
});

//add place to the listings
app.post("/listings", async (req, res) => {
  try {
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
    console.log("saved");
    
  } catch (err) {
    console.error("ERROR while getting data", err);
  }
});

// specific listing
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Listing.findById(id);
    console.log("data fetched", data.title);
    res.render("show.ejs", { data });
  } catch (err) {
    console.error("Data not found : ERROR: ", err);
  }
});

//get listing to edit 
app.get("/listings/:id/edit", async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        
        const listing = await Listing.findById(id)
        console.log(listing);
        res.render("edit.ejs", {listing})
    } catch (error) {
        console.error("Error while getting: ", error); 
    }
})

// update listing 
app.patch("/listings/:id", async(req, res) =>{
    try {
        const {id} = req.params
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect("/listings")
    } catch (error) {
        console.log(error);
        
    }
})

// delete listing
app.delete("/listings/:id", async(req, res) =>{
    try {
        const {id} = req.params
        await Listing.findByIdAndDelete(id,{...req.body.listing});
        res.redirect("/listings")
        console.log("deleted");
        
    } catch (error) {
        console.log(error); 
    }
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
