const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const flash = require("connect-flash");

const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const validateMiddleware = require("./middleware/validationMiddleware");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const logoutController = require("./controllers/logout");

const app = express();
global.loggedIn = null;

mongoose.connect("mongodb://localhost/my_database");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/posts/store", validateMiddleware);
app.use(
  expressSession({
    secret: "keyboard cat",
  }),
);
app.use((req, res, next) => {
  loggedIn = req.session.userId;
  next();
});
console.log("working");
app.use(flash());

app.get("/", homeController);
app.get("/post/new", authMiddleware, newPostController);
app.get("/post/:id", getPostController);
app.post("/posts/store", authMiddleware, storePostController);
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController,
);
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController,
);
app.get("/auth/logout", logoutController);
app.use((req, res) => res.render("notfound"));

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
