const User = require("../models/user");

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find();
      res.locals.users = users;
      next();
    } catch (error) {
      console.log(`Error fetching users: ${error.message}`);
      next(error);
    }
  },
  indexView: (req, res) => {
    res.render("users/index");
  },
  new: (req, res) => {
    res.render("users/new");
  },

  create: async (req, res, next) => {
    try {
      let userParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode,
      };

      const user = await User.create(userParams);
      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error saving user: ${error.message}`);
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
      let userId = req.params.id;
      const user = await User.findById(userId);
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },
  showView: (req, res) => {
    res.render("users/show");
  },
};
