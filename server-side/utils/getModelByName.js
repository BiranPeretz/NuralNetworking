const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Page = require("../models/pageModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Notification = require("../models/notificationModel");

const getModelByName = function (modelName) {
	switch (modelName) {
		case "user":
		case "User":
			return User;
		case "group":
		case "Group":
			return Group;
		case "page":
		case "Page":
			return Page;
		case "post":
		case "Post":
			return Post;
		case "comment":
		case "Comment":
			return Comment;
		case "notification":
		case "Notification":
			return Notification;
		default:
			return undefined;
	}
};

module.exports = getModelByName;
