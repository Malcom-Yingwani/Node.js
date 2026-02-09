// let courses = [
//   {
//     title: "Event Driven Cakes",
//     cost: 50,
//   },
//   {
//     title: "Asynchronous Artichoke",
//     cost: 25,
//   },
//   {
//     title: "Object Oriented Orange Juice",
//     cost: 10,
//   },
// ];

const Course = require("../models/course");

module.exports = {
  showCourses: async (req, res) => {
    let courses = await Course.find({});

    if (req.query.format === "json") {
      res.json(courses);
    } else {
      res.render("courses/index", { courses: courses });
    }
  },

  new: (req, res) => {
    res.render("courses/new");
  },

  create: async (req, res, next) => {
    try {
      let courseParams = {
        title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        items: req.body.items,
        zipCode: req.body.zipCode,
      };

      const course = await Course.create(courseParams);
      res.locals.redirect = "/courses";
      res.locals.course = course;
      next();
    } catch (error) {
      console.log(`Error saving course: ${error.message}`);
      next(error);
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async (req, res, next) => {
    try {
      let courseId = req.params.id;
      const course = await Course.findById(courseId);
      res.locals.course = course;
      next();
    } catch (error) {
      console.log(`Error fetching course by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: async (req, res, next) => {
    let courseId = req.params.id;

    try {
      let course = await Course.findById(courseId);
      res.render("courses/edit", { course: course });
    } catch (error) {
      console.log(`Error fetching course by ID: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    let courseId = req.params.id;

    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      cost: req.body.cost,
      items: req.body.items,
      zipCode: req.body.zipCode,
    };

    try {
      let course = await Course.findByIdAndUpdate(courseId, {
        $set: courseParams,
      });
      res.locals.redirect = `/courses/${courseId}`;
      res.locals.course = course;
      next();
    } catch (error) {
      console.log(`Error updating course by ID: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    let courseId = req.params.id;

    try {
      await Course.findByIdAndDelete(courseId);
      res.locals.redirect = "/courses";
      next();
    } catch (error) {
      console.log(`Error deleting course by ID: ${error.message}`);
      next(error);
    }
  },
};
