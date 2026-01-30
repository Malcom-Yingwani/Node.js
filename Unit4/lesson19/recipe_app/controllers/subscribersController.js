const Subscriber = require("../models/subscriber");
const mongoose = require("mongoose");

module.exports = {
  getAllSubscribers: (req, res, next) => {
    Subscriber.find({})
      .exec()
      .then((subscribers) => {
        req.data = subscribers;
        next();
      })
      .catch((error) => {
        console.error(error.message);
        next(error);
      })
      .then(() => {
        console.log("Promise Complete");
      });
  },

  displaySubscribers: (req, res, next) => {
    console.log(req.data);
    // res.send(req.data);
    res.render("subscribers", { subscribers: req.data });
  },

  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },

  saveSubscriber: (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode,
    });
    newSubscriber
      .save()
      .then((result) => {
        res.render("thanks");
      })
      .catch((error) => {
        res.send(error);
      });
  },
};
