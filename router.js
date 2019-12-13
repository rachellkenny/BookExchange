const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");

//get requests for user pages
router.get("/", userController.landing);
router.get("/register", userController.registerPage);
router.get("/login", userController.loginPage);
router.get(
  "/profile/:email",
  userController.ifUserExists,
  userController.profileScreen
);

//post requests for user functions
router.post("/registerFunction", userController.registerFunction);
router.post("/loginFunction", userController.loginFunction);
router.post("/logout", userController.logout);

//get requests for book pages
router.get("/add", bookController.addPage);
router.get("/search", bookController.searchPage);
router.get("/book/:id", bookController.singleBookPage);
router.get("/book/:id/edit", bookController.editPage);

//post requests for book functions
router.post("/addFunction", bookController.addFunction);
router.post("/book/:id/editFunction", bookController.editFunction);
router.post("/book/:id/delete", bookController.deleteFunction);
router.post("/searchFunction", bookController.searchFunction);

//misc pages
router.get("/404", userController.errorpage);
router.get("/mustbeloggedin", userController.pleaselogin);

module.exports = router;
