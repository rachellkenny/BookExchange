//handles book search, add function, update function, delete function, inventory data
const Book = require("../models/Book");

exports.addPage = function(req, res) {
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
      req.flash("success", "Book added successfully.");
      req.session.save(function() {
        res.redirect("/add");
      });
    })
    .catch(function(err) {
      req.flash("errors", err);
      req.session.save(function() {
        res.redirect("/add");
      });
    });
};

exports.searchPage = function(req, res) {
  if (req.session.user) {
    res.render("search");
  } else {
    res.render("mustbeloggedin");
  }
};

exports.searchFunction = function(req, res) {
  Book.search(req.body.searchValue)
    .then(books => {
      res.json(books);
    })
    .catch(() => {
      res.json([]);
    });
};

exports.searchResultsPage = function(req, res) {
  if (req.session.user) {
    res.render("searchresults");
  } else {
    res.render("mustbeloggedin");
  }
};

// to view single book details
exports.singleBookPage = async function(req, res) {
  if (req.session.user) {
    try {
      let book = await Book.findBookById(req.params.id, req.visitorId); //visitorid determines if current user is owner of book - defined in server.js
      res.render("singlebook", { book: book });
    } catch {
      res.render("404");
    }
  } else {
    res.render("mustbeloggedin");
  }
};

exports.editPage = async function(req, res) {
  try {
    let book = await Book.findBookById(req.params.id);
    if (book.userId == req.visitorId) {
      res.render("edit-book", { book: book });
    } else {
      res.redirect("/");
    }
  } catch {
    res.render("404");
  }
};

exports.editFunction = function(req, res) {
  let book = new Book(req.body, req.visitorId, req.params.id);
  book
    .update()
    .then(status => {
      //book was successfully updated or was not b/c of validation errors
      if (status == "success") {
        req.flash("success", "Book listing successfully updated.");
        req.session.save(function() {
          res.redirect(`/book/${req.params.id}/edit`);
        });
      } else {
        book.errors.forEach(function(error) {
          req.flash("errors", error);
        });
        req.session.save(function() {
          res.redirect(`/book/${req.params.id}/edit`);
        });
      }
    })
    .catch(() => {
      //if book with req id doesnt exist or current logged in user is not owner of book
      res.render("404");
    });
};

exports.deleteFunction = function(req, res) {
  Book.delete(req.params.id, req.visitorId)
    .then(() => {
      req.flash("success", "Book deleted successfully.");
      req.session.save(() => {
        res.redirect(`/profile/${req.session.user.email}`);
      });
    })
    .catch(() => {
      req.flash("errors", "You do not have permission to perform that action.");
      req.session.save(() => res.redirect("/"));
    });
};
