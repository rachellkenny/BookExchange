//This controller handles book search, add function, delete function, inventory data
const Book = require("../models/Book");

exports.mybooks = function(req, res) {
  if (req.session.user) {
    res.render("mybooks");
  } else {
    res.render("landing");
  }
};
exports.add = function(req, res) {
  if (req.session.user) {
    res.render("add");
  } else {
    res.render("landing");
  }
};

exports.addFunction = function(req, res) {
  let book = new Book(req.body, req.session.user._id);
  book
    .addFunction()
    .then(function() {
      res.render("add");
    })
    .catch(function(errors) {
      res.send(errors);
    });
};

exports.search = function(req, res) {
  if (req.session.user) {
    res.render("search");
  } else {
    res.render("landing");
  }
};

exports.searchResults = function(req, res) {
  if (req.session.user) {
    res.render("searchresults");
  } else {
    res.render("landing");
  }
};

// to view single book
exports.viewSingle = async function(req, res) {
  try {
    let book = await Book.findSingleById(req.params.id);
    res.render("singlebook", { book: book });
  } catch {
    res.render("404");
  }
};
