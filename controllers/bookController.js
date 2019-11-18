//This controller handles book search, add function, inventory data
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
      res.send("Book Added");
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

// // to view single book
// exports.viewBook = async function(req, res) {
//   try {
//     let book = await Book.findBookById(req.params.id);
//     res.render("searchResults", { book: book });
//   } catch {
//     res.send("Page not found.");
//   }
// };
