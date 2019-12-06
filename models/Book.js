const booksCollection = require("../db")
  .db()
  .collection("textbooks");

const ObjectID = require("mongodb").ObjectID;
const User = require("./User");

let Book = function(data, userid) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
};

Book.prototype.validate = function() {
  if (this.data.title == "") {
    this.errors.push("Please add a title");
  }
};

Book.prototype.cleanup = function() {
  this.data = {
    isbn: this.data.isbn.trim(),
    title: this.data.title.trim(),
    author: this.data.author.trim(),
    subject: this.data.subject,
    course: this.data.course.trim(),
    user: ObjectID(this.userid)
  };
};

//Add book to database
Book.prototype.addFunction = function() {
  return new Promise((resolve, reject) => {
    this.validate();
    this.cleanup();
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

// Attempted to display all from collection. Did not work.

// Book.prototype.findAll = function() {
//   return new Promise((resolve, reject) => {
//     booksCollection.find({}).toArray(function(err, res) {
//       if (err) throw err;

//       for (i = 0; i < res.length; i++) {
//         console.log(res[i]);
//       }
//     });
//   });
// };

// Find One Book
Book.findSingleById = function(id, visitorId) {
  return new Promise(async function(resolve, reject) {
    //checks to see if input is a valid mongodb object id
    if (!ObjectID.isValid(id)) {
      reject();
      return;
    }

    let books = await booksCollection
      .aggregate([
        { $match: { _id: new ObjectID(id) } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDoc"
          }
        },
        {
          $project: {
            isbn: 1,
            title: 1,
            author: 1,
            subject: 1,
            course: 1,
            userId: "$user", //$ within quotes refers to field instead of a string
            user: { $arrayElemAt: ["$userDoc", 0] }
          }
        }
      ])
      .toArray();

    books = books.map(function(book) {
      book.isVisitorOwner = book.userId.equals(visitorId);
      book.user = {
        fname: book.user.fname,
        lname: book.user.lname,
        email: book.user.email
      };
      return book;
    });

    if (books.length) {
      resolve(books[0]);
      // console.log(books[0]);
    } else {
      reject();
    }
  });
};

Book.findBooksByUserId = function(userid) {
  console.log("userid = " + userid);
  return new Promise(async function(resolve, reject) {
    let books = await booksCollection
      .aggregate([
        { $match: { user: userid } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDoc"
          }
        },
        {
          $project: {
            isbn: 1,
            title: 1,
            author: 1,
            subject: 1,
            course: 1,
            user: { $arrayElemAt: ["$userDoc", 0] }
          }
        }
      ])
      .toArray();

    books = books.map(function(book) {
      book.user = {
        fname: book.user.fname,
        lname: book.user.lname,
        email: book.user.email
      };
      return book;
    });
    console.log(books);
    resolve(books);
  });
};

module.exports = Book;
