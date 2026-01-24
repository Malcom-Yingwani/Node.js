const express = require("express");
const app = express();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const subscribersController = require("./controllers/subscribersController");

// App set up
mongoose.connect("mongodb://localhost:27017/confetti_cuisine");
mongoose.Promise = global;
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Middleware
app.use(layouts);
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(express.json());

// route handling
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/courses", homeController.showCourses);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/contact", homeController.postedSignUpForm);
app.get("/subscribers", subscribersController.getAllSubscribers);
app.post("/subscribe", subscribersController.saveSubscriber);

// Error handling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
