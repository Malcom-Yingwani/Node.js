const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const errorControllers = require("./controllers/errorControllers");
const app = express();
const layouts = require("express-ejs-layouts");

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
