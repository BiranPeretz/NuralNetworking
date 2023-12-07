const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const fetchNextBatch = require("../utils/fetchNextBatch");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Page = require("../models/pageModel");

//Helper function to check if notificationType value is allowed for initiatorType value. return results as boolean
const isAllowedType = function (initiatorType, notificationType) {
	switch (initiatorType) {
		case "User":
			return (
				notificationType === "friend request" ||
				notificationType === "new friend"
			);
		case "Group":
			return notificationType === "new member";
		case "Page":
			return notificationType === "new follower";
		case "Post":
		case "Comment":
			return notificationType === "like" || notificationType === "comment";
		default:
			return false;
	}
};

//Create new notification instance
exports.createNotification = catchAsync(async function (req, res, next) {
	//filter request properties
	const filteredBody = filterObjProperties(
		req.body,
		"userID",
		"notificationType",
		"initiatorType",
		"initiatorID"
	);
	filteredBody.initiatingUserID = req.user._id;

	//check if provided userID exists
	const user = await User.findById(filteredBody.userID);
	if (!user) {
		return next(
			new AppError(
				"Could not find an user matching provided UserID value.",
				404
			)
		);
	}

	const modelsOBJ = { Post, Comment, User, Group, Page };
	const model = modelsOBJ[filteredBody.initiatorType];

	//check if provided initiatorID exists in initiatorType collection
	const initiator = await model.findById(filteredBody.initiatorID);
	if (!initiator) {
		return next(
			new AppError(
				`Could not find initiator matching provided ID in the corresponding collection.`,
				404
			)
		);
	}

	//check if provided notificationType value is allowed for provided initiatorType value
	const isAllowedResponse = isAllowedType(
		filteredBody.initiatorType,
		filteredBody.notificationType
	);
	if (!isAllowedResponse) {
		return next(
			new AppError(
				`Notification type "${
					filteredBody.notificationType
				}" is not allowed for ${filteredBody.initiatorType.toLowerCase()} instance.`,
				400
			)
		);
	}

	//create notification
	const notification = await Notification.create(filteredBody);

	if (!notification) {
		return next(new AppError(`Could not create notification.`, 500));
	}

	//add notification to user's notifications list
	user.myNotifications.push(notification._id);
	await user.save({ validateBeforeSave: false });

	//send notification
	res.status(201).json({ status: "success", data: { notification } });
});

//Get notifications for requesting user
exports.getMyNotifications = catchAsync(async function (req, res, next) {
	res.status(200).json({
		status: "success",
		data: { notifications: req.user.myNotifications },
	});
});

//Mark all requesting user's notifications as read
exports.markAllAsRead = catchAsync(async function (req, res, next) {
	//mark all notifications as read
	const IDs = req.user.myNotifications.map((item) => item._id);
	console.log(IDs);
	const notifications = await Notification.updateMany(
		{ _id: { $in: IDs }, isRead: false },
		{ $set: { isRead: true } }
	);
	console.log(notifications);

	//send response
	res.status(200).json({ status: "success", data: null });
});

//Mark notification as read by id
exports.markAsRead = catchAsync(async function (req, res, next) {
	const notification = await Notification.findById(req.params.id);

	//check if notification
	if (!notification) {
		return next(
			new AppError(`Could not find notification with provided ID.`, 404)
		);
	}

	//check if notification belongs to requesting user
	if (notification.userID.toString() !== req.user._id.toString()) {
		return next(
			new AppError(
				`You are not authorized to perform this action on other user notification.`,
				403
			)
		);
	}

	//mark notification as read
	notification.isRead = true;
	await notification.save();

	//send response
	res.status(200).json({ status: "success", data: null });
});
