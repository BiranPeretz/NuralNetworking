const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const fetchNextBatch = require("../utils/fetchNextBatch");
const CRUDOperations = require("./CRUDOperations");
const {
	multerImageUpload,
	cloudinaryImageUpload,
} = require("./imageController");

//get all posts
exports.getAllPosts = CRUDOperations.getAll(Post);

//Create new post
exports.createPost = catchAsync(async function (req, res, next) {
	//parse form-data request with multer
	try {
		await multerImageUpload(req, res);
	} catch (err) {
		return next(
			new AppError(
				`Error parsing data with multer: ${err.message}`,
				err.statusCode || err.code || 500
			)
		);
	}
	//filter request properties
	const filteredBody = filterObjProperties(
		req.body,
		"content",
		"creatorType",
		"creatorID",
		"author"
	);

	if (filteredBody.creatorType !== "User" && !filteredBody.author) {
		const creatingUserID = req.user._id;

		if (creatingUserID === filteredBody.creatorID) {
			return next(
				new AppError(
					`Creator Type ${
						filteredBody.creatorType
					} should contain the hosting ${filteredBody.creatorType.toLowerCase()} ID as creatorID.`,
					400
				)
			);
		}

		filteredBody.author = creatingUserID;
	}

	//upload image to cloudinary and store image url
	let result;
	if (req.file) {
		try {
			req.body.type = "postImage";
			req.body.internalRequest = true;
			result = await cloudinaryImageUpload(req, res, next);
			filteredBody.content.image = result.url || "";
		} catch (err) {
			return next(
				new AppError(
					`Error uploading image to coudinary: ${err.message}`,
					err.statusCode || err.code || 500
				)
			);
		}
	}

	//create post
	const post = await Post.create(filteredBody);

	//send post
	res.status(201).json({ status: "success", data: { post } });
});

//get post by id
exports.getPostById = catchAsync(async function (req, res, next) {
	//fetch post by request parameter id
	const post = await Post.findById(req.params.id);
	//check if found matching post
	if (!post) {
		return next(new AppError("Could not find any matching post.", 404));
	}
	//send post
	res.status(200).json({
		status: "success",
		data: { post },
	});
});

//get all posts related to the requesting user (i.e. hes and hes friends, groups and pages posts)
exports.getAllUserRelatedPosts = catchAsync(async function (req, res, next) {
	const postsBy = req?.query?.postsBy; //specify posts list, all as default

	let relatedPostsQuery; //conditional posts query

	if (postsBy) {
		if (postsBy !== "friends" && postsBy !== "groups" && postsBy !== "pages") {
			//unknow posts list, return error
			return next(
				new AppError(
					`Invalid 'postsBy' value, please choose "friends", "groups" or "pages".`,
					400
				)
			);
		}
		let modelName; //conditional name of the model
		if (postsBy === "friends") {
			//posts by user's friends.
			modelName = "User";
		} else if (postsBy === "pages") {
			//posts by pages the user follow.
			modelName = "Page";
		} else if (postsBy === "groups") {
			//posts by groups the user participate.
			modelName = "Group";
		}
		relatedPostsQuery = {
			creatorID: {
				$in: req.user[postsBy + "List"].map(
					//requesting user friendsList, groupsList or pagesList
					(item) => item[postsBy.slice(0, -1)]
				),
			},
			creatorType: modelName,
		};
	} else {
		//fetch all user related posts
		relatedPostsQuery = {
			$or: [
				{ creatorID: req.user._id, creatorType: "User" }, //requesting user posts
				{
					creatorID: { $in: req.user.friendsList.map((item) => item.friend) },
					creatorType: "User",
				}, //posts by friends of requesting user
				{
					creatorID: { $in: req.user.groupsList.map((item) => item.group) },
					creatorType: "Group",
				}, //posts by groups that requested user is member of
				{
					creatorID: { $in: req.user.pagesList.map((item) => item.page) },
					creatorType: "Page",
				}, //posts by pages that requesting user follow
			],
		};
	}

	//sort by creation time decending
	const sortQuery = { timestamp: -1 };

	try {
		//fetch next batch of posts (batch data comes from front-end)
		const postsResponse = await fetchNextBatch(
			req,
			Post,
			relatedPostsQuery,
			sortQuery
		);

		//send response
		res.status(200).json(postsResponse);
	} catch (err) {
		return next(
			new AppError(
				`Error fetching next user related posts batch: ${err.message}`,
				500
			)
		);
	}
});

//TODO: build general util like function and replace
//Add like to post by ID
exports.like = catchAsync(async function (req, res, next) {
	//fetch post by request parameter id
	const post = await Post.findById(req.params.id);
	//check if found matching post
	if (!post) {
		return next(new AppError("Could not find any matching post.", 404));
	}
	//check if user already liked this post
	if (
		post.likeList.some(
			(item) => item?.user?._id?.toString() === req.user._id?.toString()
		)
	) {
		return next(new AppError("Requesting user already liked this post.", 400));
	}
	//add user to like list
	post.likeList.push({
		user: req.user._id,
	});

	//save updated post
	await post.save();

	//send updated likeList
	res.status(200).json({
		status: "success",
		data: {
			postID: post._id,
			likeList: post.likeList,
		},
	});
});

//TODO: build general util unlike function and replace
//Remove like from post by ID
exports.unlike = catchAsync(async function (req, res, next) {
	//fetch post by request parameter id
	const post = await Post.findById(req.params.id);

	//check if found matching post
	if (!post) {
		return next(new AppError("Could not find any matching post.", 404));
	}
	console.log(post.likeList);

	//check if user liked the post
	if (
		!post.likeList.some(
			(item) => item?.user?._id?.toString() === req.user._id?.toString()
		)
	) {
		return next(new AppError("Requesting user has not liked this post.", 400));
	}

	//remove user's like
	const updatedPost = await Post.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { likeList: { user: req.user._id } },
		},
		{ runValidators: true, new: true }
	);

	//send updated likeList
	res.status(200).json({
		status: "success",
		data: {
			postID: updatedPost._id,
			likeList: updatedPost.likeList,
		},
	});
});

//Add comment to post's commentsList
exports.addComment = async function (req, res, next) {
	try {
		// update post's commentsList
		const updatedPost = await Post.findByIdAndUpdate(
			req.body.postID,
			{ $push: { commentsList: req.body.commentID } },
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedPost) {
			throw new AppError("No post found matching provided post id.", 404);
		}
		//send updated post to source
		if (req.body.internalRequest) {
			return {
				status: "success",
				data: { post: updatedPost },
			};
		} else {
			res.status(200).json({
				status: "success",
				data: { post: updatedPost },
			});
		}
	} catch (error) {
		console.log(error);
		if (req.body.internalRequest) {
			throw error;
		} else {
			return next(
				new AppError(`Error adding comment to post: ${error.message}`, 500)
			);
		}
	}
};
