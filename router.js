const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");

//get requests for pages
router.get("/", userController.landing);
router.get("/register", userController.registerPage);
router.get("/login", userController.loginPage);
router.get("/mybooks", bookController.mybooks);
router.get("/add", bookController.add);
router.get("/search", bookController.search);

//post requests for functions
router.post("/registerFunction", userController.registerFunction);
router.post("/loginFunction", userController.loginFunction);
router.post("/logout", userController.logout);

module.exports = router;
