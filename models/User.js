const bcrypt = require("bcryptjs");
const usersCollection = require("../db")
  .db()
  .collection("users");
const validator = require("validator");
let User = function(data) {
  this.data = data;
  this.errors = [];
};

User.prototype.validate = async function() {
  //registration data validation
  if (this.data.fname == "" || this.data.lname == "") {
    this.errors.push("Please enter your first and last name.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("Please enter a valid email.");
  }
  if (!validator.contains(this.data.email, ".edu")) {
    this.errors.push("You must use your student email address.");
  }
  if (this.data.password == "") {
    this.errors.push("Please enter a password.");
  }
  if (this.data.password.length > 0 && this.data.password.length < 6) {
    this.errors.push("Password must be at least 6 characters.");
  }

  //check to see if email is in use after validation
  if (
    this.data.email.length > 0 &&
    validator.isEmail(this.data.email) &&
    validator.contains((this.data.email, ".edu"))
  ) {
    let emailExists = await usersCollection.findOne({ email: this.data.email });
    if (emailExists) {
      this.errors.push("This email is already in use.");
    }
  }
};

User.prototype.register = function() {
  //check for validation errors, if there are no errors, save user data to database
  this.validate();
  if (this.errors.length == 0) {
    //hash password with bcrypt
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    usersCollection.insertOne(this.data);
  }
};

User.prototype.login = function() {
  return new Promise((resolve, reject) => {
    //check if email exists, test password for match
    usersCollection.findOne(
      {
        email: this.data.email
      },
      (err, attemptedEmail) => {
        if (
          attemptedEmail &&
          bcrypt.compareSync(this.data.password, attemptedEmail.password)
        ) {
          resolve({
            fname: attemptedEmail.fname,
            lname: attemptedEmail.lname,
            email: attemptedEmail.email,
            _id: attemptedEmail._id
          });
        } else {
          reject("Invalid email or password.");
        }
      }
    );
  });
};

User.findByEmail = function(email) {
  return new Promise(function(resolve, reject) {
    usersCollection
      .findOne({ email: email })
      .then(function(userDoc) {
        if (userDoc) {
          userDoc = new User(userDoc, true);
          userDoc = {
            userid: userDoc.data._id,
            email: userDoc.data.email,
            fname: userDoc.data.fname,
            lname: userDoc.data.lname
          };
          resolve(userDoc);
        } else {
          reject();
        }
      })
      .catch(function() {
        reject();
      });
  });
};

module.exports = User;
