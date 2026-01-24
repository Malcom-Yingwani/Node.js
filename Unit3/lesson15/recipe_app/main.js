const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const errorControllers = require("./controllers/errorControllers");
const app = express();
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");

// setting up mongoose. Use mongoose for more stuctured data. The MongoDB driver for unstructured data
mongoose.connect("mongodb://localhost:27017/recipe_db");
const db = mongoose.connection;
db.once("open", () => {
  console.log("successfully connected to MongoDb using Mongoose!");
});

// const Subscriber = mongoose.model("Subscriber", subscriberSchema); // applying the schema to a model

// // Option 1
// let subscriber1 = new Subscriber({
//   name: "Jon Wexler",
//   email: "jon@jonwexler.com",
// });
// subscriber1
//   .save()
//   .then((savedDocument) => {
//     console.log(savedDocument);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// //Option 2
// Subscriber.create({
//   name: "John Baptiste",
//   email: "john@jonbaptiste.com",
// })
//   .then((savedDocument) => {
//     console.log(savedDocument);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// let myQuery = Subscriber.findOne({
//   name: "Jon Wexler",
// }).where("email", /wexler/);
// myQuery
//   .exec()
//   .then((data) => {
//     console.log(data.name);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

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

app.get("/", homeController.index);
app.get("/courses", homeController.showCourses);
app.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  subscribersController.displaySubscribers,
);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.use(errorControllers.respondNoResourceFound);
app.use(errorControllers.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
