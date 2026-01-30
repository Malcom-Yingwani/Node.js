const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/recipe_db");

async function createAndLinkUser() {
  try {
    const testUser = await User.create({
      name: {
        first: "Joe",
        last: "Wexler",
      },
      email: "joe@joewexler.com",
      password: "pass123",
    });

    const subscriber = await Subscriber.findOne({ email: testUser.email });

    testUser.subscribedAccount = subscriber;
    await testUser.save();

    console.log("user updated");
    console.log(testUser);
    return testUser;
  } catch (error) {
    console.log(error.message);
  }
}
createAndLinkUser();

// async function createTestUser() {
//   try {
//     const testUser = await User.create({
//       name: {
//         first: "Joe",
//         last: "Wexler",
//       },
//       email: "joe@joewexler.com",
//       password: "pass123",
//     });
//     console.log(testUser);
//     return testUser;
//   } catch (error) {
//     console.log(error.message);
//   }
// }
// createTestUser();

// async function findSubscriber() {
//   try {
//     const targetSubscriber = await Subscriber.findOne({
//       email: testUser.email,
//     });
//     console.log(targetSubscriber);
//     return targetSubscriber;
//   } catch (error) {
//     console.log(error.message);
//   }
// }
// findSubscriber();

// var subscriber;
// Subscriber.create({
//   name: "Joe",
//   email: "joe@jonwexler.com",
//   zipCode: "54321",
// })
//   .then((subscriber) => console.log(subscriber))
//   .catch((error) => console.log(error.message))
//   .then(() => {
//     return Subscriber.findOne({ name: "Joe" });
//   })
//   .then((result) => {
//     subscriber = result;
//     console.log(subscriber.getInfo());
//   });
// let testCourse;
// let testSubscriber;

// Course.create({
//   title: "Tomato Land",
//   description: "Locally farmed tomatoes only",
//   zipCode: 12345,
//   items: ["cherry", "heirloom"],
// })
//   .then((course) => {
//     testCourse = course;
//     return Subscriber.findOne({});
//   })
//   .then((subscriber) => {
//     testSubscriber = subscriber;
//     testSubscriber.courses.push(testCourse._id);
//     return testSubscriber.save();
//   })
//   .then((subscriber) => {
//     return subscriber.populate("courses");
//   })
//   .then((subscriber) => {
//     console.log(subscriber);
//   })
//   .catch((err) => console.log(err.message));
