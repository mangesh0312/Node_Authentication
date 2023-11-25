const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
const authcontroller = require("../controller/authcontroller");
const auth = require("../config/auth");

router.get("/login", (req, res) => res.render("login"));

router.get("/register", (req, res) => res.render("register"));

//Register handle

router.post("/register", authcontroller.register);

//Login Handle

router.post("/login", authcontroller.login);

// Logout
router.get("/logout", authcontroller.logout);

//JWT

const JWT_SECRET = "super secret";

//Forgot Password Handle

router.get("/forgot-password", (req, res) => res.render("forgotpassword"));

router.post("/forgot-password", authcontroller.forgotpassword);

// router.get("/reset-password", (req, res) => res.render("forgotpassword"));

module.exports = router;
