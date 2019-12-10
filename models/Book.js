const booksCollection = require("../db")
  .db()
  .collection("textbooks");

const ObjectID = require("mongodb").ObjectID;
const User = require("./User");

let Book = function (data, userid, reqBookId) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.reqBookId = reqBookId;
};

Book.prototype.validate = function () {
  if (this.data.title == "") {
    this.errors.push("Please add a title");
  }
};

Book.prototype.cleanup = function () {
  this.data = {
    isbn: this.data.isbn.trim(),
    title: this.data.title.trim(),
    author: this.data.author.trim(),
    subject: this.data.subject,
    course: this.data.course.trim(),
    user: ObjectID(this.userid)
  };
};

//add book to db
Book.prototype.addFunction = function () {
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

//update existing book in db
Book.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let book = await Book.findBookById(this.reqBookId, this.userid);
      if (book.isVisitorOwner) {
        let status = await this.actuallyUpdate();
        resolve(status);
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

Book.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanup();
    this.validate();
    if (!this.errors.length) {
      await booksCollection.findOneAndUpdate(
        { _id: new ObjectID(this.reqBookId) },
        {
          $set: {
            isbn: this.data.isbn,
            title: this.data.title,
            author: this.data.author,
            subject: this.data.subject,
            course: this.data.course
          }
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};


// Display 1 book on sep page
Book.findBookById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
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

    books = books.map(function (book) {
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
    } else {
      reject();
    }
  });
};

//to display user's book on profile page
Book.findBooksByUserId = function (userid) {
  return new Promise(async function (resolve, reject) {
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

    books = books.map(function (book) {
      book.user = {
        fname: book.user.fname,
        lname: book.user.lname,
        email: book.user.email
      };
      return book;
    });
    resolve(books);
  });
};

Book.delete = function (bookId, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let book = await Book.findBookById(bookId, currentUserId);
      if (book.isVisitorOwner) {
        await booksCollection.deleteOne({ _id: new ObjectID(bookId) })
        resolve();
        console.log("everything's fine")
      } else {
        reject();
        console.log("ids do not match")
      }
    }
    catch{
      reject();
      console.log("some other dumb error")
    }
  })
}

module.exports = Book;
