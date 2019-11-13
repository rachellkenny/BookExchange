const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

//configuration code for sessions -- cookie should last 1 day
let sessionOptions = session({
  secret: "SecretString",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

app.use(sessionOptions); // allows login sessions - saves to database
app.use(flash()); // for page alerts

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

const router = require("./router");

//allow express to accept and use data from forms/json objects
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set directory for different interfaces
app.use(express.static("public"));
app.set("views", "UIs");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
