const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

//Create and login users
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//forgot password and reset
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//Get requesting user's data
router.get("/me", userController.getMyData);

//Get requesting user's socials list
router.get("/socialsList", userController.getSocialsList);

//Create user profile
router.patch("/createProfile", userController.createProfile);

//Remove user's friend request
// router.patch("/removeFriendRequest/:id", userController.removeFriendRequest);

//Send friend request
router.patch("/sendFriendRequest/:id", userController.sendFriendRequest);

//Reject friend request
router.patch("/rejectFriendRequest/:id", userController.rejectFriendRequest);

//Accept friend request
router.patch("/acceptFriendRequest/:id", userController.acceptFriendRequest);

//Add item to chosen user's list
router.patch("/addListItem", userController.addListItem);

//Remove item from chosen user's list
router.patch("/removeListItem", userController.removeListItem);

//Get user social suggestions (post because need to send data)
router.post("/mySuggestions", userController.mySuggestions);

//Get all users
router.get("/", userController.getAllUsers);

//Get user by id
router.get("/:id", userController.getUserById);

module.exports = router;
