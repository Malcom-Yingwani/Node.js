const User = require("../models/user");
const passport = require("passport");

const getUserParams = (body) => {
  return {
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    password: body.password,
    zipCode: body.zipCode,
  };
};

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find();
      res.locals.users = users;
      console.log(`Found users: ${users}`);
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
      if (req.skip) return next();

      const newUser = new User(getUserParams(req.body));

      const user = await User.register(newUser, req.body.password);

      req.flash("success", `${user.fullName}'s account created successfully!`);
      res.locals.redirect = "/users";
      next();
    } catch (e) {
      req.flash(
        "error",
        `Failed to create user account because: ${e.message}.`,
      );
      res.locals.redirect = "/users/new";
      next();
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
      console.log(`found user info: ${user}`);
      next();
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("users/show");
  },

  edit: async (req, res, next) => {
    let userId = req.params.id;
    try {
      let user = await User.findById(userId);
      res.render("users/edit", {
        user: user,
      });
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    let userId = req.params.id;
    let userParams = getUserParams(req.body);
    console.log(
      `userParams before: name:${userParams.name} | email:${userParams.email} | zipCode:${userParams.zipCode}`,
    );
    try {
      let user = await User.findByIdAndUpdate(userId, {
        $set: userParams,
      });
      res.locals.redirect = `/users/${userId}`;
      res.locals.user = user;
      console.log(`userParams after: ${user}`);
      next();
    } catch (error) {
      console.log(`Error updating user by ID: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    let userId = req.params.id;
    try {
      await User.findByIdAndDelete(userId);
      res.locals.redirect = "/users";
      console.log(`deleted User: ${userId}`);
      next();
    } catch (error) {
      console.log(`Error deleting user by ID: ${error.message}`);
      next(error);
    }
  },
  login: (req, res) => {
    res.render("users/login");
  },
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!",
  }),
  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
};
