//This controller handles book search, add function, delete function, inventory data
const Book = require("../models/Book");

exports.mybooks = function(req, res) {
  if (req.session.user) {
    res.render("mybooks");
  } else {
    res.render("mustbeloggedin");
  }
};
exports.add = function(req, res) {
  if (req.session.user) {
    res.render("add", { errors: req.flash("errors") });
  } else {
    res.render("mustbeloggedin");
  }
};

exports.addFunction = function(req, res) {
  let book = new Book(req.body, req.session.user._id);
  book
    .addFunction()
    .then(function() {
      res.render("bookadded");
    })
    .catch(function(err) {
      req.flash("errors", err);
      req.session.save(function() {
        res.redirect("/add");
      });
    });
};

exports.bookadded = function(req, res) {
  res.render("bookadded");
};

exports.search = function(req, res) {
  if (req.session.user) {
    res.render("search");
  } else {
    res.render("mustbeloggedin");
  }
};

exports.searchResults = function(req, res) {
  if (req.session.user) {
    res.render("searchresults");
  } else {
    res.render("mustbeloggedin");
  }
};

// to view single book
exports.viewSingle = async function(req, res) {
  if (req.session.user) {
    try {
      let book = await Book.findSingleById(req.params.id, req.visitorId); //visitorid determines if current user is owner of book - defined in server.js
      res.render("singlebook", { book: book });
    } catch {
      res.render("404");
    }
  } else {
    res.render("mustbeloggedin");
  }
};
