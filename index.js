const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const session = require("express-session");

//set view engine and folder
app.set("view engine", "ejs");
app.set("views", "views");

//set urlencoded extended to get access to req.body
app.use(express.urlencoded({ extended: true }));

//setting session params
app.use(
  session({
    secret: "thisshouldbeareallygoodlongsecret",
    resave: false,
    saveUninitialized: true,
  })
);

//require login middleware to protect routes
const requireLogin=(req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect("/login");
    }
    next();
}

//db connection
mongoose.connect("mongodb://localhost:27017/authdemo");

//base get routes
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/secret",requireLogin,(req,res)=>{
    res.render("secret")
})

//register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body; //destructuring form inputs
  const user = new User({username,password});
  await user.save();
  req.session.user_id = user._id; //setting the session user
  res.redirect("/");
});

//logout route
app.post("/logout",requireLogin,async (req,res)=>{
    req.session.destroy; //destroy the session on logout
    res.redirect("/login");
})

//login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;//destructuring form inputs
  const user=await User.findAndValidate(username,password);
  if (user) { //if a valid user is returned perform login
    req.session.user_id = user._id;
    res.redirect("/secret")
  } else {
    res.send("Try again");
  }
});

app.get("/", (req, res) => {
    res.send("Hello");
  });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
