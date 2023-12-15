const express = require("express");
const authController = require("../controllers/authController");
const imageController = require("../controllers/imageController");

const router = express.Router();

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//uploading image
// router.post("/upload", imageController.uploadImage);

module.exports = router;
