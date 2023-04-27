const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome');
});

router.get('/signup', function (req, res) {
  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      message: "",
      email: "",
      confirmEmail: "",
      password: ""
    };
  }
  req.session.inputData = null;
  res.render('signup',{inputData: sessionInputData});
});

router.get('/login', function (req, res) {
  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      message: "",
      email: "",
      password: ""
    };
  }
  req.session.inputData = null;
  res.render('login',{inputData: sessionInputData});
});

router.post('/signup', async function (req, res) {
  const userData = req.body;
  const userEmail = userData.email;
  const userEmailRe = userData["confirm-email"];
  const userPassword = userData.password;

  if (
    userPassword.trim() < 6 ||
    userEmail !== userEmailRe ||
    !userEmail.includes("@")) {

      req.session.inputData = {
        hasError: true,
        message: "Invalid input - Check your data",
        email: userEmail,
        confirmEmail: userEmailRe,
        password: userPassword
      };

      req.session.save(function () {
        res.redirect("/signup");
      });
      return;
  }

  const isUserExisting = await db.getDb().collection("users").findOne({email: userEmail});
  if (isUserExisting) {
    req.session.inputData = {
      hasError: true,
      message: "User already exist",
      email: userEmail,
      confirmEmail: userEmailRe,
      password: userPassword
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(userPassword, 12);

  const user = {
    email: userEmail,
    password: hashedPassword
  };

  const result = await db.getDb().collection("users").insertOne(user);
  console.log(result);
  res.redirect("/login");
});

router.post('/login', async function (req, res) {
  const userData = req.body;
  const userEmail = userData.email;
  const userPassword = userData.password;
  const isUserExisting = await db.getDb().collection("users").findOne({email: userEmail});
  if(!isUserExisting) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials",
      email: userEmail,
      password: userPassword
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(userPassword, isUserExisting.password);
  if(!isPasswordCorrect) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials",
      email: userEmail,
      password: userPassword
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }
  
  req.session.user = {
    id: isUserExisting._id,
    email: isUserExisting.email
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/profile");
  });
});

router.get('/admin', async function (req, res) {
  if (!res.locals.isAuth) { // !req.session.user
    return res.status(401).render("401");
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render('403');
  }
  res.render('admin');
});

router.get('/profile', function (req, res) {
  if (!res.locals.isAuth) { // !req.session.user
    return res.status(401).render("401");
  }
  res.render('profile');
});

router.post('/logout', function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect('/');
});

module.exports = router;
