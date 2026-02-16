const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");
const User = require("./models/user");

mongoose.connect("mongodb://0.0.0.0:27017/recipe_db");


// async function createAndLinkUser() {
//   try {
//     const testUser = await User.create({
//       name: {
//         first: "Tracy",
//         last: "September"
//       },
//       email: "tracy@outlook.com",
//       password: "pass123"
//     });
    
//     const subscriber = await Subscriber.findOne({ email: testUser.email });
    
//     testUser.subscribedAccount = subscriber;
    
//     await testUser.save();
    
//     console.log("user updated");
//     console.log(testUser);
//     return testUser;
//   } catch (error) {
//     console.log(error.message);
//   }
// }
// createAndLinkUser();


// Subscriber.create({
//   name: "Bhabha",
//   email: "bhabha@email.com",
//   zipCode: "12345",
// })
//   .then((subscriber) =>
//   console.log(subscriber)
//   )
//   .catch((error) => console.log(error.message));



// let subscriber;

// Subscriber.findOne({
//   name: "Bhabha",
// }).then((result) => {
//   subscriber = result;
//   console.log(subscriber.getInfo());
// });

// Course.create({
//   title: "Tomato Land 2",
//   description: "Locally farmed tomatoes only2",
//   zipCode: 12345,
//   items: ["cherry", "heirloom"],
// })
//   .then((course) => {
//     Subscriber.findOne({})
//     .then((subscriber) => {
//       subscriber.courses.push(course._id);
//       return subscriber.save();
//     });
//   })
//   .then((subscriber) => {
//     return Subscriber.populate(subscriber, "courses");
//   })
//   .then((subscriber) => {
//     console.log(subscriber);
//   })
//   .catch((err) => console.error(err));
