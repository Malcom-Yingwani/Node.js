const BlogPost = require("../models/BlogPost.js");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const image = req.files.image;

    await image.mv(
      path.resolve(__dirname, "..", "public/assets/img", image.name),
    );

    await BlogPost.create({
      ...req.body,
      image: "/assets/img/" + image.name,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
