const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");

mongoose.connect("mongodb://localhost:27017/recipe_db");

// var subscriber;
// Subscriber.create({
//   name: "Malcom",
//   email: "nsovomalcom@gmail.com",
//   zipCode: "12345",
// })
//   .then((subscriber) => console.log(subscriber))
//   .catch((error) => console.log(error.message))
//   .then(() => {
//     return Subscriber.findOne({ name: "Malcom" });
//   })
//   .then((result) => {
//     subscriber = result;
//     console.log(subscriber.getInfo());
//   });
let testCourse;
let testSubscriber;

Course.create({
  title: "Tomato Land",
  description: "Locally farmed tomatoes only",
  zipCode: 12345,
  items: ["cherry", "heirloom"],
})
  .then((course) => {
    testCourse = course;
    return Subscriber.findOne({});
  })
  .then((subscriber) => {
    testSubscriber = subscriber;
    testSubscriber.courses.push(testCourse._id);
    return testSubscriber.save();
  })
  .then((subscriber) => {
    return subscriber.populate("courses");
  })
  .then((subscriber) => {
    console.log(subscriber);
  })
  .catch((err) => console.log(err.message));
