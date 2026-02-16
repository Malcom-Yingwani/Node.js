const port = 3000;
const express = require("express");
const passport = require("passport");
const methodOverride = require("method-override");
const User = require("./models/user");

const router = require("./routes/index");
const app = express();

const layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");

const expressSession = require("express-session");
const connectFlash = require("connect-flash");

mongoose.connect("mongodb://localhost:27017/recipe_db");
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("view engine", "ejs");
// =========================================================
//                               MIDDLEWARE

app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(express.json());

app.use(layouts);
app.use(express.static("public"));

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  }),
);

app.use(
  expressSession({
    secret: "a_very_long_and_secure_secret_passcode",
    cookie: {
      maxAge: 4_000_000, //approx 1hr
    },
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated(); // Passport method to check if user is logged in
  res.locals.currentUser = req.user; // The logged-in user object
  next();
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", router);

// =============================================

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
