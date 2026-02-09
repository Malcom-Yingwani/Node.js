const express = require("express");
const app = express();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const userController = require("./controllers/userController");
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

// Home routes
app.get("/", homeController.displayHomePage);
app.get("/courses", homeController.showCourses);

// Subscriber routes
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

// User routes
router.get("/users", userController.index, userController.indexView);
router.get("/users/new", userController.new);
router.post(
  "/users/create",
  userController.create,
  userController.redirectView,
);
router.get("/users/:id", userController.show, userController.showView);
router.get("/users/:id/edit", userController.edit);
router.put(
  "/users/:id/update",
  userController.update,
  userController.redirectView,
);
router.delete(
  "/users/:id/delete",
  userController.delete,
  userController.redirectView,
);

// Error handling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

/*
Code Summary

This code sets up a basic Node.js web server using Express and connects it to a MongoDB database with Mongoose. The application uses EJS as its 
templating engine along with express-ejs-layouts to manage page layouts.

Key features include:
Database Connection: Connects to a local MongoDB database named confetti_cuisine.

Middleware Configuration:
Parses URL-encoded and JSON request bodies.
Serves static files from the public directory.

App Configuration:
Sets the server port (defaulting to 3000).
Configures EJS as the view engine.

Routing:
Renders the home page at /.
Displays courses using homeController.showCourses.
Handles subscriber-related routes, including viewing subscribers, showing a contact/subscription page, and saving new subscribers.

Error Handling:
Uses custom controllers to handle 404 (page not found) and 500 (internal server) errors.

Server Startup:
Starts the server and logs the running URL to the console.
Overall, this application follows an MVC-style structure, separating routing logic, controllers, views, and database interactions for better 
organization and maintainability.
*/
