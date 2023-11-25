const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const app = express();

require("./config/passport")(passport);

const port = process.env.port || 8000;

const db = require("./config/key").MongoURI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("error", err));
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.json());

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//ROUTES
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is up and runing on port: ${port}`);
});
