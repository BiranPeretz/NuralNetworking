const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

const router = express.Router();

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//get all posts
router.get("/", postController.getAllPosts);

//Create new post
router.post("/createPost", postController.createPost);

//get all post related to requesting user
router.get("/user-related", postController.getAllUserRelatedPosts);

//like post by id
router.patch("/:id/like", postController.like);

//unlike post by id
router.patch("/:id/unlike", postController.unlike);

//get post by postID
router.get("/:id", postController.getPostById);

module.exports = router;
