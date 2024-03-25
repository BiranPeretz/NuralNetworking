const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const Post = require("../models/postModel");
const { addComment } = require("./postController");
const { createNotification } = require("./notificationController");

//Create new comment
exports.createComment = catchAsync(async function (req, res, next) {
	//check request body for parentCommentID
	if (req.body.parentCommentID) {
		return next(
			new AppError("Wrong end-point, use /createCommentReply instead.", 400)
		);
	}

	//filter request body properties
	const filteredBody = filterObjProperties(req.body, "postID", "content");

	//add requesting user's _id as userID
	filteredBody.userID = req.user._id;
	//create comment
	const comment = await Comment.create(filteredBody);

	let updateResponse;
	try {
		//try to add the comment to the post's comments list
		req.body.commentID = comment?._id;
		req.body.postID = comment?.postID;
		req.body.internalRequest = true;

		updateResponse = await addComment(req, res, next);

		//if added post comment try to create notification
		let notificationResponse;
		if (updateResponse.status === "success") {
			try {
				req.body.internalNotificationRequest = true;
				//userID is the post author or creator, populated or not
				req.body.userID =
					updateResponse?.data?.post?.author?._id.toString() ||
					updateResponse?.data?.post?.author.toString() ||
					updateResponse?.data?.post?.creatorID?._id.toString() ||
					updateResponse?.data?.post?.creatorID.toString();
				req.body.notificationType = "comment";
				req.body.initiatorType = "Post";
				req.body.initiatorID =
					updateResponse?.data?.post?._id?.toString() ||
					updateResponse?.data?.post?.toString();
				const results = await createNotification(req, res, next);
				if (results.status === "success") {
					notificationResponse = results;
				}
			} catch (error) {
				console.log(error);
				notificationResponse = error;
			}
		}

		//send response
		res.status(201).json({
			status: "success",
			data: {
				comment,
				post: updateResponse?.data?.post,
				notificationResponse,
			},
		});
	} catch (err) {
		//linkage faield, delete created comment
		if (comment) {
			await Comment.findByIdAndDelete(comment._id);
			return next(
				new AppError(
					`Error linking new comment to it's post: ${err.message}`,
					err.statusCode || 500
				)
			);
		}
	}
});

//Create new comment reply
exports.createCommentReply = catchAsync(async function (req, res, next) {
	//check request body for postID
	if (req.body.postID) {
		return next(
			new AppError("Wrong end-point, use /createComment instead.", 400)
		);
	}

	//fetch parent comment
	const parentComment = await Comment.findById(req.body.parentCommentID);

	//validate parent comment value
	if (!parentComment) {
		return next(new AppError(`Could not find provided parent comment.`, 404));
	}

	//filter request body properties
	const filteredBody = filterObjProperties(
		req.body,
		"content",
		"parentCommentID"
	);

	//add requesting user's _id as userID
	filteredBody.userID = req.user._id;
	//copy parent comment postID
	filteredBody.postID = parentComment.postID;

	//create comment reply
	const comment = await Comment.create(filteredBody);

	parentComment.childCommentIDs.push(comment._id);
	await parentComment.save();

	const post = await Post.findById(comment.postID);

	//try to create notification
	let notificationResponse;
	try {
		req.body.internalNotificationRequest = true;
		req.body.userID =
			parentComment?.userID?._id?.toString() ||
			parentComment?.userID?.toString();
		req.body.notificationType = "comment";
		req.body.initiatorType = "Comment";
		req.body.initiatorID = parentComment?._id.toString();
		const results = await createNotification(req, res, next);
		if (results.status === "success") {
			notificationResponse = results;
		}
	} catch (error) {
		console.log(error);
		notificationResponse = error;
	}

	//send response
	res.status(201).json({
		status: "success",
		data: {
			comment,
			parentComment,
			post,
			notificationResponse,
		},
	});
});

//Add like to comment by ID
exports.like = catchAsync(async function (req, res, next) {
	//fetch comment by request parameter id
	const comment = await Comment.findById(req.params.id);
	//check if found matching comment
	if (!comment) {
		return next(new AppError("Could not find any matching comment.", 404));
	}

	//check if user already liked this comment
	if (
		comment.likeList.some(
			(item) => item?.user?._id?.toString() === req.user._id?.toString()
		)
	) {
		return next(
			new AppError("Requesting user already liked this comment.", 400)
		);
	}

	//add user to like list
	comment.likeList.push({
		user: req.user._id,
	});

	//save updated comment
	await comment.save();

	//try to create notification
	let notificationResponse;
	try {
		req.body.internalNotificationRequest = true;
		req.body.userID =
			comment?.userID?._id?.toString() || comment?.userID?.toString();
		req.body.notificationType = "like";
		req.body.initiatorType = "Comment";
		req.body.initiatorID = comment?._id.toString();
		const results = await createNotification(req, res, next);
		if (results.status === "success") {
			notificationResponse = results;
		}
	} catch (error) {
		console.log(error);
		notificationResponse = error;
	}

	const post = await Post.findById(comment.postID);

	//send updated likeList
	res.status(200).json({
		status: "success",
		data: {
			commentID: comment._id,
			likeList: comment.likeList,
			postID: comment.postID,
			notificationResponse,
			post,
		},
	});
});

//Remove like from comment by ID
exports.unlike = catchAsync(async function (req, res, next) {
	//fetch comment by request parameter id
	const comment = await Comment.findById(req.params.id);

	//check if found matching comment
	if (!comment) {
		return next(new AppError("Could not find any matching comment.", 404));
	}

	//check if user liked the comment
	if (
		!comment.likeList.some(
			(item) => item?.user?._id?.toString() === req.user._id?.toString()
		)
	) {
		return next(
			new AppError("Requesting user has not liked this comment.", 400)
		);
	}

	//remove user's like
	const updatedComment = await Comment.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { likeList: { user: req.user._id } },
		},
		{ runValidators: true, new: true }
	);

	const post = await Post.findById(comment.postID);

	//send updated likeList
	res.status(200).json({
		status: "success",
		data: {
			commentID: updatedComment._id,
			likeList: updatedComment.likeList,
			postID: updatedComment.postID,
			post,
		},
	});
});
