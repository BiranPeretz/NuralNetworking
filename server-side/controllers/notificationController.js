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
const getModelByName = require("../utils/getModelByName");

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
exports.createNotification = async function (req, res, next) {
	try {
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
			throw new AppError(
				"Could not find an user matching provided UserID value.",
				404
			);
		}

		const modelsOBJ = { Post, Comment, User, Group, Page };
		const model = modelsOBJ[filteredBody.initiatorType];

		//check if provided initiatorID exists in initiatorType collection
		const initiator = await model.findById(filteredBody.initiatorID);
		if (!initiator) {
			throw new AppError(
				`Could not find initiator matching provided ID in the corresponding collection.`,
				404
			);
		}

		//check if provided notificationType value is allowed for provided initiatorType value
		const isAllowedResponse = isAllowedType(
			filteredBody.initiatorType,
			filteredBody.notificationType
		);
		if (!isAllowedResponse) {
			throw new AppError(
				`Notification type "${
					filteredBody.notificationType
				}" is not allowed for ${filteredBody.initiatorType.toLowerCase()} instance.`,
				400
			);
		}

		//create notification
		const notification = await Notification.create(filteredBody);

		if (!notification) {
			throw new AppError(`Could not create notification.`, 500);
		}

		console.log("before:", user.myNotifications);

		//add notification to user's notifications list
		user.myNotifications.unshift(notification._id);
		await user.save({ validateBeforeSave: false });
		console.log("after:", user.myNotifications);

		//send notification according to source
		if (req?.body?.internalNotificationRequest === true) {
			return { status: "success", data: { notification } };
		} else {
			res.status(201).json({ status: "success", data: { notification } });
		}
	} catch (error) {
		console.log(error);
		if (req?.body?.internalNotificationRequest === true) {
			throw error;
		} else {
			return next(
				new AppError(
					`Error creating notification: ${error.message}`,
					error.statusCode || 500
				)
			);
		}
	}
};

const getSelectProps = function (initiatorType) {
	switch (initiatorType) {
		case "User":
			console.log(
				"in switch, in case User, initiatorType value:",
				initiatorType
			);
			return "_id fullName profilePicture";
		case "Group":
		case "Page":
			console.log(
				"in switch, in case Group/Page, initiatorType value:",
				initiatorType
			);
			return "_id name profilePicture";
		case "Post":
			console.log(
				"in switch, in case Post, initiatorType value:",
				initiatorType
			);
			return "_id content";
		case "Comment":
			console.log(
				"in switch, in case Comment, initiatorType value:",
				initiatorType
			);
			return "_id content";
		default:
			console.log(
				"in switch, in case default, initiatorType value:",
				initiatorType
			);
			return undefined;
	}
};

//Get notifications for requesting user
exports.getMyNotifications = catchAsync(async function (req, res, next) {
	const query = {
		_id: {
			$in: req.user.myNotifications,
		},
	};
	const sortQuery = { timestamp: -1 };

	try {
		//fetch next batch of notifications
		const results = await fetchNextBatch(req, Notification, query, sortQuery);

		const notificationsArr = results.data;

		//populate each of the notifications
		for (let notification of notificationsArr) {
			await Notification.populate(notification, [
				{ path: "userID", select: "_id fullName profilePicture" },
				{ path: "initiatingUserID", select: "_id fullName profilePicture" },
			]);

			await Notification.populate(notification, {
				path: "initiatorID",
				model: getModelByName(notification.initiatorType),
				select: getSelectProps(notification.initiatorType),
				options: { autopopulate: false },
			});
		}

		//send response
		res.status(200).json(results);
	} catch (err) {
		return next(
			new AppError(
				`Error fetching next user's notifications batch: ${err.message}`,
				500
			)
		);
	}
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

	//check if notification is not read already
	if (notification.isRead === true) {
		return next(new AppError(`This notification has already read.`, 400));
	}

	//mark notification as read
	notification.isRead = true;
	await notification.save();

	//send response
	res.status(200).json({ status: "success", data: null });
});
