const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const errorControllers = require("./controllers/errorControllers");
const app = express();
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

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

// ============= routes ============
app.get("/", homeController.index);
app.get("/courses", coursesController.showCourses);

app.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  subscribersController.displaySubscribers,
);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.get("/users", usersController.index, usersController.indexView);

app.use(errorControllers.respondNoResourceFound);
app.use(errorControllers.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
