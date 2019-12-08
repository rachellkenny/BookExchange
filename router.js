const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");

//user routes for get reqs
router.get("/", userController.landing);
router.get("/register", userController.registerPage);
router.get("/login", userController.loginPage);
router.get(
  "/profile/:email",
  userController.ifUserExists,
  userController.profileScreen
);

//user routes for post reqs
router.post("/registerFunction", userController.registerFunction);
router.post("/loginFunction", userController.loginFunction);
router.post("/logout", userController.logout);

//get requests for book-related pages
router.get("/mybooks", bookController.mybooks);
router.get("/add", bookController.add);
router.get("/search", bookController.search);
router.get("/searchResults", bookController.searchResults);
router.get("/book/:id", bookController.viewSingle);
router.get("/book/:id/edit", bookController.viewEditScreen);

//post requests for book functions
router.post("/addFunction", bookController.addFunction);
router.post("/book/:id/edit", bookController.editFunction);
router.post("/book/:id/delete", bookController.deleteFunction);

//misc pages
router.get("/404", userController.errorpage);
router.get("/mustbeloggedin", userController.pleaselogin);

module.exports = router;
