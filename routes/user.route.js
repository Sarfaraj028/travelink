import { Router } from "express";
import User from "../models/user.model.js";
import passport from "passport";

const userRouter = Router();

//get signup
userRouter.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//post signup
userRouter.post("/signup", async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.flash("success", `welcome ${username}`);
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error", e.message);
        console.log(e.message);
        res.redirect("/user/signup")
        
    }
});


//get signup
userRouter.get("/signin", (req, res) => {
    res.render("users/signin.ejs");
  });

  //post signin
userRouter.post("/signin", passport.authenticate('local',{failureRedirect: "/user/signin", failureFlash: true}), async (req, res) => {
    req.flash("success", `Welcone back to travelink`)
    res.redirect("/listings")
});

export default userRouter;
