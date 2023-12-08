const express = require("express");
const authController = require("../controllers/authController");
const pageController = require("../controllers/pageController");

const router = express.Router();

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//Get all pages
router.get("/", pageController.getAllPages);

//Get all pages owned by requesting user
router.get("/getMyPages", pageController.getMyPages);

//Create new page
router.post("/createPage", pageController.createPage);

module.exports = router;
