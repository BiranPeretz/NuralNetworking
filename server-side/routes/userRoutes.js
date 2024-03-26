const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

//Create and login users
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//forgot and reset password
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//send and verify email
router.post("/sendVerificationEmail", authController.sendVerificationEmail);
router.patch("/verifyEmail/:token", authController.verifyEmail);

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//Get requesting user's data
router.get("/me", userController.getMyData);

//Get requesting user's socials list
router.get("/socialsList", userController.getSocialsList);

//Create user profile
router.patch("/createProfile", userController.createProfile);

//Send friend request
router.patch("/sendFriendRequest/:id", userController.sendFriendRequest);

//Reject friend request
router.patch("/rejectFriendRequest/:id", userController.rejectFriendRequest);

//Accept friend request
router.patch("/acceptFriendRequest/:id", userController.acceptFriendRequest);

//Add item to chosen user's list
router.patch("/addListItem", userController.modifyListItem);

//Remove item from chosen user's list
router.patch("/removeListItem", userController.modifyListItem);

//Get user social suggestions (post because need to send data)
router.post("/mySuggestions", userController.mySuggestions);

//Search users by full name
router.get("/searchUsers", userController.searchUsersByFullName);

//Get all users
router.get("/", userController.getAllUsers);

//Get user by id
router.get("/:id", userController.getUserById);

module.exports = router;
