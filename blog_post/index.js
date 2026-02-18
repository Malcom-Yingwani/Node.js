const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");

const app = express();

mongoose.connect("mongodb://localhost/my_database");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
  res.render("index", { blogposts });
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/post/new", (req, res) => {
  res.render("create");
});
app.get("/post/:id", async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render("post", { blogpost });
});

app.post("/posts/store", async (req, res) => {
  try {
    await BlogPost.create(req.body);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
