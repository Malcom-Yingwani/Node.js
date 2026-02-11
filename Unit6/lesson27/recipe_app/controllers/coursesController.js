const Course = require("../models/course");
const httpStatus = require("http-status-codes");
const User = require("../models/user");

module.exports = {
  showCourses: async (req, res, next) => {
    let courses = await Course.find({});

    res.locals.courses = courses; // Always store in res.locals

    // If this is an API route, continue to respondJSON
    if (req.originalUrl.startsWith("/api")) {
      next();
    } else {
      // Otherwise render the view for regular web route
      res.render("courses/index", {
        courses: courses,
      });
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
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.StatusCodes.OK,
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId,
        },
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;

    if (currentUser) {
      let mappedCourses = res.locals.courses.map((course) => {
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });

        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },
};
