import express from "express";
import connection from "./db/db.js";
import dotenv from "dotenv";
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import CustomError from "./utils/CustomError.js";
import router from "./routes/route.listings.js";
import reviewsRouter from "./routes/route.reviews.js";
import cookieParser from "cookie-parser";
import session from "express-session";


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

//session example
app.use(session({
  secret: "express_secret",
  resave: false,
  saveUninitialized: true,
}))

app.get("/get-count", (req, res) =>{
  if(req.session.count) {
    req.session.count++
  }
  else{
    req.session.count = 1
  }
  res.send(`sent request ${req.session.count} times`)
})

//all listings routes
app.use("/listings", router)
app.use("/listings/:id/reviews", reviewsRouter)


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
