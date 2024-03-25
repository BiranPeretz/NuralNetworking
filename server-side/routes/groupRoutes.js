const express = require("express");
const authController = require("../controllers/authController");
const groupController = require("../controllers/groupController");

const router = express.Router();

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//Get all groups
router.get("/", groupController.getAllGroups);

//Search groups by name
router.get("/searchGroups", groupController.searchGroupsByName);

//Create new group
router.post("/createGroup", groupController.createGroup);

module.exports = router;
