const express = require("express");
const app = express();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const router = express.Router();
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const mongoose = require("mongoose");
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
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use("/", router);

// route handling
router.get("/", (req, res) => {
  res.render("index");
});
router.get("/courses", homeController.showCourses);
// router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/contact", homeController.postedSignUpForm);
// app.get("/subscribers", subscribersController.getAllSubscribers);
// router.post("/subscribe", subscribersController.saveSubscriber);
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView,
);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView,
);
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView,
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView,
);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView,
);

// Error handling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
