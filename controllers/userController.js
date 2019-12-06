//This controller handles user registration, login, profile pages

const User = require("../models/User");
const Book = require("../models/Book");

///Functions that render the pages
exports.landing = function(req, res) {
  if (req.session.user) {
    res.render("home");
  } else {
    res.render("landing");
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
      console.log(req.session.user.id);
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

exports.pleaselogin = function(req, res) {
  res.render("mustbeloggedin");
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

//THIS RENDERS PROFILE W/O BOOKS IF U NEED TO UNFUCK IT UP
// exports.profileScreen = function(req, res) {
//   res.render("profile", {
//     fname: req.profileUser.fname,
//     lname: req.profileUser.lname,
//     email: req.profileUser.email
//   });
// };

exports.profileScreen = function(req, res) {
  //find books by user id to display personal inventory
  Book.findBooksByUserId(req.profileUser.userid)
    .then(function(books) {
      res.render("profile", {
        books: books,
        fname: req.profileUser.fname,
        lname: req.profileUser.lname,
        email: req.profileUser.email
      });
    })
    .catch(function() {
      res.render("404");
      console.log(req.profileUser);
    });
};
