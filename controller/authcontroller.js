const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//User Model
const User = require("../models/User");

exports.register = (req, res) => {
  //console.log(req.body);
  const { name, email, password, password2 } = req.body;

  let errors = [];

  //Check all fields required
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please put all fields" });
  }

  //Check password match
  if (password !== password2) {
    errors.push({ msg: "Password not match" });
  }

  //Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "User is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        console.log("NewUser", newUser);
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            //Set password to hash
            newUser.password = hash;
            //Save user
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "Registration done successfully");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
};

//Login handle
exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

//logout handle
exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
};
//Forgot password handle

exports.forgotpassword = async (req, res, next) => {
  let error = [];
  //Get Email from database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    errors.push({ msg: "Please put all fields" });
  }

  const resettoken = user.resetpasswordtoken();
  await user.save();
};
