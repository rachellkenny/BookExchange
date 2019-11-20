const booksCollection = require("../db")
  .db()
  .collection("textbooks");

const ObjectID = require("mongodb").ObjectID;
const User = require("./User");

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

//Add book to database
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

//Find One Book
Book.findSingleById = function(id) {
  return new Promise(async function(resolve, reject) {
    //checks to see if input is a valid mongodb object id
    if (!ObjectID.isValid(id)) {
      reject();
      return;
    }
    let books = await //aggregate allows multiple operations to be performed on database -- in this case, find book AND find user by id
    booksCollection
      .aggregate([
        { $match: { _id: new ObjectID(id) } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userOfBook"
          }
        },
        {
          $project: {
            isbn: 1,
            title: 1,
            author: 1,
            subject: 1,
            course: 1,
            user: 1
            // user: { $arrayElemAt: [$userOfBook, 0] }
          }
        }
      ])
      .toArray();

    // books = books.map(function(book) {
    //   book.user = {
    //     fname: book.user.fname,
    //     lname: book.user.lname,
    //     email: book.user.email
    //   };
    //   return book;
    // });

    if (books.length) {
      resolve(books[0]);
      console.log(books[0]);
      //console.log(userOfBook[0]);
    } else {
      reject();
    }
  });
};

module.exports = Book;
