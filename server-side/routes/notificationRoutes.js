const express = require("express");
const authController = require("../controllers/authController");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

//Restrict all routes defined after this line for logged in users only
router.use(authController.protect);

//Create new notification
router.post("/createNotification", notificationController.createNotification);

//Get all unread notifications of requesting user
router.get("/getMyNotifications", notificationController.getMyNotifications);

//Mark all requesting user's notifications as read
router.patch("/markAsRead", notificationController.markAllAsRead);

//Mark notification as read by id
router.patch("/markAsRead/:id", notificationController.markAsRead);

module.exports = router;
