const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const errorControllers = require("./controllers/errorControllers");
const app = express();
const layouts = require("express-ejs-layouts");

/* Imports the MongoDB client from the mongodb package
  Defines the MongoDB connection URL and database name
   Connects to the MongoDB server
  Selects the recipe_db database
   Fetches all documents from the contacts collection
  Converts the results to an array
  Logs the retrieved data to the console
Throws an error if any step fails */

const MongoDB = require("mongodb").MongoClient;
const dbURL = "mongodb://localhost:27017";
const dbName = "recipe_db";

MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;
  let db = client.db(dbName);

  db.collection("contacts").insert(
    {
      name: "Freddie Mercury",
      email: "fred@queen.com",
    },
    (error, db) => {
      if (error) throw error;
      console.log(db);
    },
  );

  db.collection("contacts")
    .find()
    .toArray((error, data) => {
      if (error) throw error;
      console.log(data);
    });
});

app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(express.json());
app.use(layouts);
app.use(errorControllers.logErrors);
app.get("/name/:myName", homeController.respondWithName);

app.use(errorControllers.respondNoResourceFound);
app.use(errorControllers.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
