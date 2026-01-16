const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const app = express();

// use() allows to write our own middleware functions
app.use((req, res, next) => { 
  console.log(`request made to: ${req.url}`);
  next(); // next paramater function simply moves on to the next bit of middleware to run if any
});

// Tells express application to parse URL-encoded data.
app.use(
  express.urlencoded({
    extended: false,
  })
);

// converts raw data into a json object
app.use(express.json());

app.get("/items/:vegetable", homeController.sendReqParam);

app.post("/", homeController.sendPostReq);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
