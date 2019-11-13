//This controller handles user registration, login, profile page

const User = require("../models/User");

///Functions that render the pages
exports.landing = function(req, res) {
  if (req.session.user) {
    res.render("home");
  } else {
    res.render("landing", { errors: req.flash("errors") });
  }
};
exports.registerPage = function(req, res) {
  res.render("register", { regErrors: req.flash("regErrors") });
};
exports.loginPage = function(req, res) {
  res.render("login", { errors: req.flash("errors") });
};

//Functions that perform tasks
exports.registerFunction = function(req, res) {
  let user = new User(req.body);
  user.register();
  if (user.errors.length > 0) {
    user.errors.forEach(function(error) {
      req.flash("regErrors", error);
    });
    req.session.save(function() {
      res.redirect("/register");
    });
  } else {
    res.redirect("/login");
  }
};

exports.loginFunction = function(req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function(result) {
      req.session.user = {
        email: user.data.email,
        fname: result.fname,
        lname: result.lname,
        _id: result._id
      };
      req.session.save(function() {
        res.redirect("/");
      });
    })
    .catch(function(err) {
      req.flash("errors", err);
      req.session.save(function() {
        res.redirect("/login");
      });
    });
};

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect("/");
  });
};
