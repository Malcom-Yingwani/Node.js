module.exports = (req, res, next) => {
  if (req.files == null || req.body.title == null) {
    console.log("Please submit a valid post");
    return res.redirect("/post/new");
  }
  next();
};
