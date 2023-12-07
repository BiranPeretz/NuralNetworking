const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	userID: {
		//ID of the user that recive the notification
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "Notification must contain it's target user ID."],
	},
	timestamp: { type: Date, default: Date.now }, //Notification action occurrence timestamp
	notificationType: {
		type: String,
		enum: [
			"like",
			"comment",
			"friend request",
			"new friend",
			"new member",
			"new follower",
		],
		required: [true, "Notification must contain it's type."],
	},
	initiatorType: {
		//Source of the notification (Post/Comment for like/comment, User for friend request and new friend, Group for new member and Page for new follower)
		type: String,
		enum: ["Post", "Comment", "User", "Group", "Page"],
		required: [true, "Notification must contain it's initiator type."],
	},
	initiatorID: {
		//Initiator ID according to this.initiatorType
		type: mongoose.Schema.ObjectId,
		refPath: "initiatorType",
		required: true,
	},
	initiatingUserID: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "Notification must contain it's initiating user ID."],
	},
	isRead: { type: Boolean, default: false }, //False until notification has been seen by the user.
});

//Deselect mongoDB's __v property
notificationSchema.pre(/^find/, function () {
	this.select("-__v");
});

//more __v prop removal
notificationSchema.post("save", function (doc, next) {
	if (doc.__v !== undefined) {
		delete doc._doc.__v;
	}
	next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
