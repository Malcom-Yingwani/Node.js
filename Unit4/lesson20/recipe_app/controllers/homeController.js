module.exports = {
  respondWithName: (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName });
  },

  displayHomePage: (req, res) => {
    res.render("index");
  },
};
