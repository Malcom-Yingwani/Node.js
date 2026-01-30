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
};
