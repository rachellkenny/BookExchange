//This controller handles user registration, login, profile pages

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

exports.errorpage = function(req, res) {
  if (req.session.user) {
    res.render("404");
  } else {
    res.render("landing");
  }
};

exports.ifUserExists = function(req, res, next) {
  User.findByEmail(req.params.email)
    .then(function(userDoc) {
      req.profileUser = userDoc;
      next();
    })
    .catch(function() {
      res.render("404");
    });
};

exports.profileScreen = function(req, res) {
  res.render(
    "profile"
    // , {
    //   profileName: req.profileUser.fname + " " + req.profileUser.lname
    // }
  );
};
