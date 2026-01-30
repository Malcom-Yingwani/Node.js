const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const errorControllers = require("./controllers/errorControllers");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

const router = express.Router();
const app = express();

const layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");
// setting up mongoose. Use mongoose for more stuctured data. The MongoDB driver for unstructured data
mongoose.connect("mongodb://localhost:27017/recipe_db");
const db = mongoose.connection;
db.once("open", () => {
  console.log("successfully connected to MongoDb using Mongoose!");
});

// =============== Middleware ==============

app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
app.use(errorControllers.logErrors);

app.use("/", router);

// ============= routes ============
router.get("/", homeController.index);
router.get("/courses", coursesController.showCourses);

router.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  subscribersController.displaySubscribers,
);
router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/subscribe", subscribersController.saveSubscriber);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView,
);
router.get("/users/:id", usersController.show, usersController.showView);

app.use(errorControllers.respondNoResourceFound);
app.use(errorControllers.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
