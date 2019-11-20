const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");

//get requests for user pages
router.get("/", userController.landing);
router.get("/register", userController.registerPage);
router.get("/login", userController.loginPage);
router.get("/404", userController.errorpage);
router.get(
  "/profile/:email",
  userController.ifUserExists,
  userController.profileScreen
);
//get requests for book-related pages
router.get("/mybooks", bookController.mybooks);
router.get("/add", bookController.add);
router.get("/search", bookController.search);
router.get("/searchResults", bookController.searchResults);
router.get("/book/:id", bookController.viewSingle);

//post requests for user functions
router.post("/registerFunction", userController.registerFunction);
router.post("/loginFunction", userController.loginFunction);
router.post("/logout", userController.logout);

//post requests for book functions
router.post("/addFunction", bookController.addFunction);

module.exports = router;
