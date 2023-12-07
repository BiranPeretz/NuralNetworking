const express = require("express");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");

const router = express.Router();

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//Create new comment
router.post("/createComment", commentController.createComment);

//Create new comment reply
router.post("/createCommentReply", commentController.createCommentReply);

//like comment by id
router.patch("/:id/like", commentController.like);

//unlike comment by id
router.patch("/:id/unlike", commentController.unlike);

module.exports = router;
