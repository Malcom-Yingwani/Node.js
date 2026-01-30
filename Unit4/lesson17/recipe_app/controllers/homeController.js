let courses = [
  {
    title: "Event Driven Cakes",
    cost: 50,
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25,
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10,
  },
];

exports.respondWithName = (req, res) => {
  // let paramsName = req.params.myName;
  res.render("index", { name: paramsName });
};
exports.index = (req, res) => {
  res.render("index");
};

exports.showCourses = (req, res) => {
  res.render("courses", {
    offeredCourses: courses,
  });
};
