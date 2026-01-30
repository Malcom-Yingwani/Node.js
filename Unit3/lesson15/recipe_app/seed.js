const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db");

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connected successfully to recipe_db");
});
let contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016,
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103,
  },
];
let commands = [];
Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  })
  .then(() => {
    contacts.forEach((c) => {
      commands.push(
        Subscriber.create({
          name: c.name,
          email: c.email,
          zipCode: c.zipCode,
        }),
      );
    });
  });

Promise.all(commands)
  .then((r) => {
    console.log(JSON.stringify(r));
  })
  .catch((error) => {
    console.log(`ERROR: ${error}`);
  })
  .finally(() => {
    mongoose.connection.close();
  });
