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
    res.render("users/index", {
      flashMessages: {
        success: "Loaded all users!",
      },
    });
  },
  new: (req, res) => {
    res.render("users/new");
  },

  create: async (req, res, next) => {
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
    try {
      let userParams = getUserParams(req.body);

      const user = await User.create(userParams);

      req.flash("success", `${user.fullName}'s account created successfully!`);

      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error saving user: ${error.message}`);

      res.locals.redirect = "/users/new";
      req.flash(
        "error",
        `Failed to create user account because: ${error.message}.`,
      );

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
      res.render("users/edit", { user: user });
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      res.locals.redirect = "/users/new";
      req.flash(
        "error",
        `Failed to create user account because: ➥${error.message}.`,
      );
      next(error);
    }
  },

  update: async (req, res, next) => {
    let userId = req.params.id;
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };

    try {
      let user = await User.findByIdAndUpdate(userId, { $set: userParams });
      res.locals.redirect = "/users";
      res.locals.user = user;
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
      next();
    } catch (error) {
      console.log(`Error deleting user by ID: ${error.message}`);
      next(error);
    }
  },
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: async (req, res, next) => {
    try {
      // Check whether a user is found
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        // Call the password comparison method on the User model
        const passwordsMatch = await user.passwordComparison(req.body.password);

        if (passwordsMatch) {
          res.locals.redirect = `/users/${user._id}`;
          req.flash("success", `${user.fullName}'s logged in successfully!`);
          res.locals.user = user;
        } else {
          req.flash(
            "error",
            "Failed to log in user account: Incorrect Password.",
          );
          res.locals.redirect = "/users/login";
        }
        next();
      } else {
        // User account not found
        req.flash(
          "error",
          "Failed to log in user account: User account not found.",
        );
        res.locals.redirect = "/users/login";
        next();
      }
    } catch (error) {
      console.log(`Error logging in user: ${error.message}`);
      next(error);
    }
  },
  validate: async (req, res, next) => {
    // Validate and sanitize fields
    req.sanitizeBody("email").normalizeEmail({ all_lowercase: true }).trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({ min: 5, max: 5 });
    req.check("password", "Password cannot be empty").notEmpty();

    try {
      // Collect the results of previous validations
      const error = await req.getValidationResult();

      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true; // Set skip property to true
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    } catch (err) {
      console.log(`Error in validation: ${err.message}`);
      next(err);
    }
  },
};
