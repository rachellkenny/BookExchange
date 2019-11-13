const booksCollection = require("../db")
  .db()
  .collection("textbooks");

const ObjectID = require("mongodb").ObjectID;

let Book = function(data, userid) {
  this.data = data;
  this.errors = [];
  this.alerts = [];
  this.userid = userid;
};

Book.prototype.validate = function() {
  if (this.data.title == "") {
    this.errors.push("Please add a title.");
  }
};

Book.prototype.getAuthor = function() {
  this.data.user = ObjectID(this.userid);
};

Book.prototype.addFunction = function() {
  return new Promise((resolve, reject) => {
    this.validate();
    this.getAuthor();
    if (this.errors.length == 0) {
      booksCollection
        .insertOne(this.data)
        .then(() => {
          resolve();
        })
        .catch(() => {
          this.errors.push("Database Connection Error");
        });
    } else {
      reject(this.errors);
    }
  });
};

Book.findBookById = function(id) {
  return new Promise(async function(resolve, reject) {
    if (!ObjectID.isValid(id)) {
      reject();
      return;
    }
    let book = await booksCollection.findOne({ _id: new ObjectID(id) });
    if (book) {
      resolve(book);
    } else {
      reject();
    }
  });
};
module.exports = Book;
