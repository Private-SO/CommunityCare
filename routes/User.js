/**
 * @author Mayank Bagla, Ram prasath Meganathan( B00851418)
 */

//API Routes

const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
const Feedback = require("../models/feedback");
const covidscreening = require("../models/covidscreening");
const Product = require("../models/userModel");
const e = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const nodemailer = require("nodemailer");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const d = new Date();

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "Mayank",
      sub: userID,
    },
    "Mayank",
    { expiresIn: "1h" }
  );
};

let mailTransporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "csci5709_group23@hotmail.com",
    pass: "",
  },
});

userRouter.post("/register", (req, res) => {
  const { username, password, firstname, lastname, role } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err)
      res.status(500).json({
        message: { msgBody: "Error has in findone occured", msgError: true },
      });
    if (user)
      res.status(400).json({
        message: {
          msgBody:
            "This Email Id is already registered with us. Please try again.",
          msgError: true,
        },
      });
    else {
      const newUser = new User({
        username,
        password,
        firstname,
        lastname,
        role,
      });
      newUser.save((err) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured in saving",
              msgError: true,
            },
          });
        else
          res
            .status(200)
            .json({ message: { msgBody: "Account created", msgError: false } });
      });
    }
  });
});

userRouter.put("/reset", (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    JWT.verify(resetLink, "Mayank", function (error, decodeData) {
      if (error) {
        return res.status(401).json({
          message: {
            msgBody: "Incorrect token or token expired.",
            msgError: true,
          },
        });
      } else {
        User.findOne({ resetLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              message: {
                msgBody: "User with this token does not exist",
                msgError: true,
              },
            });
          }
          const obj = {
            password: newPass,
            resetLink: "",
          };
          user = _.extend(user, obj);
          user.save((err, result) => {
            if (err) {
              res.status(400).json({
                message: { msgBody: "Reset password error", msgError: true },
              });
            } else {
              return res.status(200).json({
                message: {
                  msgBody: "Your password has been changed",
                  msgError: false,
                },
              });
            }
          });
        });
      }
    });
  } else {
    res
      .status(401)
      .json({ message: { msgBody: "Authentication Error", msgError: true } });
  }
});

userRouter.put("/notifyRequestor", (req, res) => {
  const username = req.body.reqEmail;
  console.log(username);
  let mailDetails = {
    from: "csci5709_group23@hotmail.com",
    to: username,
    subject: `Donation Post Closed: ${req.body.qty} ${req.body.item}`,
    html: `<h3> Hi, </h3>
          <p> The donation post for ${req.body.qty} ${req.body.item} 
          has been marked delivered to you by ${req.body.donorEmail}.
          This item will now appear in your user dashboard.</p>
          <p>If this was a mistake, please email us at csci5709_group23@hotmail.com</p>
          <p>All the best,</p>
          <p>Community Care </p>`,
  };
  mailTransporter.sendMail(mailDetails, function (error, body) {
    if (error) {
      console.log(error);
      return res.json({
        error: error,
      });
    } else {
      console.log("Message Sent");
      return res.json({
        message: {
          msgBody: "Email has been sent. Please check your Email.",
          msgError: false,
        },
      });
    }
  });
});

userRouter.put("/forgot", (req, res) => {
  const { username } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err)
      res.status(500).json({
        message: { msgBody: "Error occured in DB occured", msgError: true },
      });
    if (!user)
      res.status(400).json({
        message: { msgBody: "Username does not exists", msgError: true },
      });
    else {
      const token = JWT.sign({ _id: username._id }, "Mayank", {
        expiresIn: "1h",
      });
      let mailDetails = {
        from: "csci5709_group23@hotmail.com",
        to: username,
        subject: "Reset Password",
        html: `<h2> Click on the link below to reset your password.</h2>
              Click <a href=" https://communitycare-app.herokuapp.com/resetlink/${token}"> here</a> to reset your password`,
      };

      return user.updateOne({ resetLink: token }, function (err, success) {
        if (err) {
          res.status(400).json({
            message: { msgBody: "Reset password link error", msgError: true },
          });
        } else {
          mailTransporter.sendMail(mailDetails, function (error, body) {
            if (error) {
              return res.json({
                message: { msgBody: error.message, msgError: true },
              });
            }
            return res.json({
              message: {
                msgBody: "Email has been sent. Please check you Email.",
                msgError: false,
              },
            });
          });
        }
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

userRouter.post(
  "/todo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const todo = new Todo(req.body);
    todo.save((err) => {
      if (err)
        res
          .status(500)
          .json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        req.user.todos.push(todo);
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "Error has occured", msgError: true },
            });
          else
            res.status(200).json({
              message: { msgBody: "successfully addedd", msgError: false },
            });
        });
      }
    });
  }
);

userRouter.get(
  "/todos",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById({ _id: req.user._id })
      .populate("todos")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        else {
          res.status(200).json({ todos: document.todos, authenticated: true });
        }
      });
  }
);

userRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "admin") {
      res
        .status(200)
        .json({ message: { msgBody: "Admin logged in", msgError: false } });
    } else
      res.status(403).json({
        message: { msgBody: "you're not an admin, go away", msgError: true },
      });
  }
);

userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
  }
);

userRouter.get("/username/:email", (req, res, next) => {
  const id = req.params.email;
  Product.find({ email: id, active: ["active", "complete"] })
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

userRouter.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      //   if (docs.length >= 0) {
      res.status(200).json(docs);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

userRouter.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    address: req.body.address,
    zip: req.body.zip,
    phone: req.body.phone,
    quantity: req.body.quantity,
    itemtype: req.body.itemtype,
    date: new Date(),
    active: "pending",
    reqemail: "",
    donorhistory:
      monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(),
  });
  console.log(req.body);
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

userRouter.get("/itemtype/:item", (req, res, next) => {
  const id = req.params.item;
  Product.find({ itemtype: id, active: "active" })
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

userRouter.get("/reqemail/:email", (req, res, next) => {
  const email = req.params.email;
  Product.find({ reqemail: email, active: "complete" })
    .exec()
    .then((data) => {
      console.log(data);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "User does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

userRouter.post("/mailing", (req, res) => {
  const {
    address,
    donorhistory,
    email,
    firstname,
    itemtype,
    lastname,
    phone,
    quantity,
    zip,
  } = req.body;
  // const emailb = address + " " + donorhistory + " " + email + " "+ itemtype+ " "+ quantity;
  const email_body =
    "<h2>Donor Invoice</h2><h3>Name:" +
    firstname +
    " " +
    lastname +
    '</h3><table style="border-collapse:collapse;width: 100%;"><tr><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Date</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Item Type</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Quantity</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Address</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Phone No.</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Email</th></tr><tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
    donorhistory +
    '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
    itemtype +
    '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
    quantity +
    '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
    address +
    " " +
    zip +
    '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
    phone +
    '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
    email +
    "</td></tr></table>";

  let mailDetails = {
    from: "csci5709_group23@hotmail.com",
    to: email,
    subject: "Invoice mail",
    html: email_body,
  };

  mailTransporter.sendMail(mailDetails, function (error, body) {
    if (error) {
      return res.json({ message: { msgBody: error.message, msgError: true } });
    }
    return res.json({
      message: {
        msgBody: "Email has been sent. Please check you Email.",
        msgError: false,
      },
    });
  });
});

userRouter.post("/addfeedback", (req, res) => {
  if (req.body) {
    const userFeedback = new Feedback({
      _id: new mongoose.Types.ObjectId(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      comments: req.body.comments,
    });

    userFeedback.save();
    responseMessage = res.status(200).send({
      message: { msgBody: "Feedback Sent successfully", msgError: false },
    });
  } else {
    res.status(407).json({
      success: false,
      message: "error occured",
    });
  }
});

userRouter.get("/feedback", (req, res) => {
  Feedback.find()
    .exec()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

userRouter.post("/covidscreen", (req, res) => {
  if (req.body) {
    email = req.body.email;
    covidpositive = req.body.covidpositive;
    covidscreening.findOne({ email }, (err, result) => {
      if (err)
        res.status(500).json({
          message: { msgBody: "Error has in findone occured", msgError: true },
        });
      if (result) {
        covidscreening.updateOne(
          { email: result.email },
          { $set: { covidpositive: covidpositive } },
          (err, result) => {
            if (err) {
              return console.log(error);
            }
            res.status(200).send("screening result updated successfully");
          }
        );
      } else {
        const covidscreen = new covidscreening({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          covidpositive: req.body.covidpositive,
        });
        covidscreen.save();
        responseMessage = res
          .status(200)
          .send("screening result updated successfully");
      }
    });
  } else {
    res.status(407).json({
      success: false,
      message: "error occured",
    });
  }
});

module.exports = userRouter;
