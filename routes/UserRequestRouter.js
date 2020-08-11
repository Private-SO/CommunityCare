/**
 * @author Ryan Fernandes
 */

const express = require("express");
const bodyParser = require("body-parser");
const userRequestRouter = express.Router();
const mongoose = require("mongoose");
const donor = require("../models/userModel");

userRequestRouter.use(bodyParser.json());

userRequestRouter.route("/:status").put((req, res, next) => {
  if (req.params.status == "Approve") {
    donor.findByIdAndUpdate(
      { _id: req.body.id },
      { active: "active" },
      function (err, d) {
        if (err) {
          return res.send(err);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send({ message: "Success" });
        }
      }
    );
  } else if (req.params.status === "complete") {
    donor.findByIdAndUpdate(
      { _id: req.body.id },
      { active: "complete", reqemail: req.body.reqemail },
      { new: true },
      function (err, d) {
        if (err) {
          return res.send(err);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send(d);
        }
      }
    );
  } else {
    donor.findByIdAndUpdate(
      { _id: req.body.id },
      { active: "inactive" },
      function (err, d) {
        if (err) {
          return res.send(err);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send({ message: "Success" });
        }
      }
    );
  }
});

userRequestRouter.route("/").get((req, res, next) => {
  donor.find({ active: "pending" }, function (err, d) {
    if (err) {
      return res.send(err);
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(d);
    }
  });
});

module.exports = userRequestRouter;
