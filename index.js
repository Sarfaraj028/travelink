import express from "express";
import connection from "./db/db.js";
import dotenv from "dotenv";
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import CustomError from "./utils/CustomError.js";
import router from "./routes/route.listings.js";
import reviewsRouter from "./routes/route.reviews.js";
// import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";


dotenv.config();
const PORT = process.env.PORT;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static("public"))

app.use(flash())

//session example
app.use(session({
  secret: "express_secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}))

//Home page
app.get("/", (req, res) => {
  res.send("Home page");
});


app.use((req, res, next) =>{
  res.locals.successMSG = req.flash("success")
  res.locals.errorMSG = req.flash("error")
  next()
})

// app.get("/register", (req, res) =>{
//   let {name = ''} = req.query
//   req.session.name = name;
//   if(name === ''){
//     req.flash("error", "Error while Registering!")
//   }
//   else{
//     req.flash("success", "User Registered Successfully!")
//   }
//   res.redirect("/hello")
// })

// app.get("/hello", (req, res) =>{
//   res.locals.successMSG = req.flash("success")
//   res.locals.errorMSG = req.flash("error")
//   res.render("profile.ejs", {name: req.session.name})
// })

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
