const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Find User
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Email is not Registered" });
          }

          //match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password does not match" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  //serializing the user to decide which key is to be kept in the cookies
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //deserializing the user from the key in the cookies

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        console.log("error in finding the user ----> Passport");
        return done(err);
      });
  });
};
