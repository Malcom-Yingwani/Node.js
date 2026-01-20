const express = require("express");
const app = express();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController.js");
const layouts = require("express-ejs-layouts");

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
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);

// Error handling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
