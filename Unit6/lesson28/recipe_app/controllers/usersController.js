const User = require("../models/user");
const validator = require("express-validator");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
// const token = process.env.TOKEN || "recipeT0k3n";
const jsonWebToken = require("jsonwebtoken");
const httpStatus = require("http-status-codes");

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
    res.render("users/new", {
      user: res.locals.user || {
        name: { first: "", last: "" },
        email: "",
        zipCode: "",
      },
    });
  },

  create: async (req, res, next) => {
    const getUserParams = (body) => {
      return {
        name: {
          first: body.first,
          last: body.last,
        },
        email: body.email,
        zipCode: body.zipCode,
      };
    };

    try {
      let userParams = getUserParams(req.body);

      // Create a new user instance (without password)
      const newUser = new User(userParams);

      // Use passport-local-mongoose's register method to hash the password
      const user = await User.register(newUser, req.body.password);

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
      const user = await User.findById(userId).populate("courses");
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
      res.locals.redirect = `/users/${userId}`;
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

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    });
  },

  authenticate: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("error", "Failed to login.");
        return res.redirect("/users/login");
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", `${user.fullName}'s logged in successfully!`);
        return res.redirect("/");
      });
    })(req, res, next);
  },
  validate: [
    // Validation and sanitization chains
    body("email")
      .trim()
      .normalizeEmail({ all_lowercase: true })
      .isEmail()
      .withMessage("Email is invalid"),

    body("zipCode")
      .notEmpty()
      .withMessage("Zip code is invalid")
      .isInt()
      .withMessage("Zip code is invalid")
      .isLength({ min: 5, max: 5 })
      .withMessage("Zip code is invalid"),

    body("password").notEmpty().withMessage("Password cannot be empty"),

    // Validation result handler
    (req, res, next) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          let messages = errors.array().map((e) => e.msg);
          req.skip = true;
          req.flash("error", messages.join(" and "));

          res.locals.user = {
            name: {
              first: req.body.first || "",
              last: req.body.last || "",
            },
            email: req.body.email || "",
            zipCode: req.body.zipCode || "",
            // Don't send password back for security
          };

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
  ],
  apiAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        let signedToken = jsonWebToken.sign(
          {
            data: user._id,
            exp: new Date().setDate(new Date().getDate() + 1),
          },
          "secret_encoding_passphrase",
        );
        res.json({
          success: true,
          token: signedToken,
        });
      } else
        res.json({
          success: false,
          message: "Could not authenticate user.",
        });
    })(req, res, next);
  },
  verifyJWT: async (req, res, next) => {
    let token = req.headers.token;

    if (token) {
      jsonWebToken.verify(
        token,
        "secret_encoding_passphrase",
        async (errors, payload) => {
          if (payload) {
            try {
              const user = await User.findById(payload.data);

              if (user) {
                next();
              } else {
                res.status(httpStatus.FORBIDDEN).json({
                  error: true,
                  message: "No User account found.",
                });
              }
            } catch (error) {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: "Database error.",
              });
            }
          } else {
            res.status(httpStatus.UNAUTHORIZED).json({
              error: true,
              message: "Cannot verify API token.",
            });
          }
        },
      );
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: true,
        message: "Provide Token",
      });
    }
  },

  // SIMPLE API TOKEN
  // verifyToken: (req, res, next) => {
  //   if (req.query.apiToken === token) next();
  //   else next(new Error("Invalid API token."));
  // },

  // UNIQUE API TOKEN
  // verifyToken: async (req, res, next) => {
  //   let token = req.query.apiToken;

  //   if (token) {
  //     try {
  //       const user = await User.findOne({ apiToken: token });

  //       if (user) {
  //         next();
  //       } else {
  //         next(new Error("No user found with such token"));
  //       }
  //     } catch (error) {
  //       next(new Error(error.message));
  //     }
  //   } else {
  //     next(new Error("No token found in URL"));
  //   }
  // },
  // Method 3 JWT
  verifyJWT: async (req, res, next) => {
    let token = req.headers.token;

    if (token) {
      jsonWebToken.verify(
        token,
        "secret_encoding_passphrase",
        async (errors, payload) => {
          if (payload) {
            try {
              const user = await User.findById(payload.data);

              if (user) {
                next();
              } else {
                res.status(httpStatus.StatusCodes.FORBIDDEN).json({
                  error: true,
                  message: "No User account found.",
                });
              }
            } catch (error) {
              res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: "Database error.",
              });
            }
          } else {
            res.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
              error: true,
              message: "Cannot verify API token.",
            });
          }
        },
      );
    } else {
      res.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
        error: true,
        message: "Provide Token",
      });
    }
  },
};
