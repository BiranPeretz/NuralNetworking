const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const Group = require("../models/groupModel");
const Page = require("../models/pageModel");
const mongoose = require("mongoose");
const CRUDOperations = require("./CRUDOperations");
const suggestionAgg = require("../utils/suggestionAgg");
const getListAgg = require("../utils/getListAgg");

//get all users
exports.getAllUsers = CRUDOperations.getAll(User);

//get user by id
exports.getUserById = catchAsync(async function (req, res, next) {
	//fetch user by request parameter id
	const user = await User.findById(req.params.id);
	//check if found matching user
	if (!user) {
		return next(new AppError("Could not find matching user.", 404));
	}
	//send user
	res.status(200).json({
		status: "success",
		data: { user },
	});
});

//Get the user's data associated with auth token
exports.getMyData = catchAsync(async function (req, res, next) {
	//send users data as the "protect" middleware already validated the request
	res.status(200).json({
		status: "success",
		data: { user: req.user },
	});
});

//Create user profile after signup/login before first login
exports.createProfile = catchAsync(async function (req, res, next) {
	//check if full name
	if (!req.body.fullName) {
		return next(new AppError("Please provide your full name.", 400));
	}
	//store fullName and about to filter array
	const filteredArray = ["fullName", "about"];
	//add pofilePicture if included in the request
	if (req.body.profilePicture) {
		filteredArray.push("profilePicture");
	}
	//filter req.body to filtered array
	const filteredBody = filterObjProperties(req.body, ...filteredArray);
	//update user data
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});
	//send updated user
	res.status(200).json({ status: "success", data: { user: updatedUser } });
});

//TODO: refactor this and removeListItem as both functions are very similar
//Add item to user social list (friends, groups, pages, friendRequests)
exports.addListItem = async function (req, res, next) {
	try {
		const { list, itemId } = req.body;
		const listType = list.slice(0, -5); //friend || group || page || friendRequest

		// validate list value
		if (
			!list ||
			(list !== "friendsList" &&
				list !== "groupsList" &&
				list !== "pagesList" &&
				list !== "friendRequestsList")
		) {
			throw new AppError("Please provide a valid list property.", 400);
		}

		let model;
		let itemListName;
		switch (list) {
			case "friendsList":
				//limit adding friends for internal requests only
				if (!req.body.internalRequest) {
					throw new AppError("Adding an friend require their approval.", 403);
				}
				model = User;
				itemListName = list;
				break;
			case "groupsList":
				model = Group;
				itemListName = "membersList";
				break;
			case "pagesList":
				model = Page;
				itemListName = "followersList";
				break;
			case "friendRequestsList":
				model = User;
				itemListName = list;
				break;
		}

		//check if item exists on database on supposed collection
		const itemExists = await model.findById({ _id: itemId.toString() });
		if (!itemExists) {
			throw new AppError("Provided item does not exist on provided list.", 404);
		}

		//check if list already contains the item
		if (
			req.user[list].some((item) => {
				console.log(item[listType]);
				console.log(listType);
				return item[listType]?._id.toString() === itemId?.toString();
			})
		) {
			throw new AppError("Item already exists in the list.", 400);
		}

		//construct the query
		const query = { $push: {} };
		query.$push[list] = req.senderQuery || {
			[listType]: itemExists._id,
			connection: {
				status: "accepted",
				timestamp: Date.now(),
			},
		};
		// update user's list
		const updatedUser = await User.findByIdAndUpdate(req.user.id, query, {
			new: true,
			runValidators: true,
		});

		const itemQuery = { $push: {} };
		if (listType === "friend" || listType === "friendRequest") {
			itemQuery.$push[itemListName] = req.receiverQuery || {
				[listType]: updatedUser._id,
				connection: {
					status: "accepted",
					timestamp: Date.now(),
				},
			};
		} else {
			itemQuery.$push[itemListName] = updatedUser._id;
		}

		const updatedItem = await model.findByIdAndUpdate(
			itemExists._id,
			itemQuery,
			{
				new: true,
				runValidators: true,
			}
		);

		//send updated user to source
		if (req.body.internalRequest) {
			return {
				status: "success",
				data: { user: updatedUser, sourceItem: updatedItem },
			};
		} else {
			res.status(200).json({
				status: "success",
				data: { user: updatedUser, sourceItem: updatedItem },
			});
		}
	} catch (error) {
		console.log(error);
		if (req.body.internalRequest) {
			throw error;
		} else {
			return next(
				new AppError(
					`Error adding item to user list: ${error.message}`,
					error.statusCode || 500
				)
			);
		}
	}
};

//TODO: refactor this and addListItem as both functions are very similar
//Remove item from user social list (friends, groups, pages, friendRequests)
exports.removeListItem = async function (req, res, next) {
	try {
		const { list, itemId } = req.body;
		const listType = list.slice(0, -5); //friend || group || page || friendRequest

		let model;
		let itemListName;
		//validate list and initialize variables
		switch (list) {
			case "friendsList":
				model = User;
				itemListName = list;
				break;
			case "groupsList":
				model = Group;
				itemListName = "membersList";
				break;
			case "pagesList":
				model = Page;
				itemListName = "followersList";
				break;
			case "friendRequestsList":
				model = User;
				itemListName = list;
				break;
			default:
				throw new AppError("Please provide a valid list property.", 400);
		}

		//check if item exists on database on supposed collection
		const itemExists = await model.findById({ _id: itemId.toString() });
		if (!itemExists) {
			throw new AppError("Provided item does not exist on provided list.", 404);
		}

		//check if item exists on supposed list
		if (
			!req.user[list].some((item) => {
				console.log(item[listType]);
				console.log(listType);
				return item[listType]?._id.toString() === itemId?.toString();
			})
		) {
			throw new AppError("Item does not exists on that list the list.", 400);
		}

		//construct the query
		const query = { $pull: {} };
		query.$pull[list] = {
			[listType]: itemExists._id,
		};
		//update user's list
		const updatedUser = await User.findByIdAndUpdate(req.user.id, query, {
			new: true,
		});

		const itemQuery = { $pull: {} };
		if (listType === "friend" || listType === "friendRequest") {
			itemQuery.$pull[itemListName] = {
				[listType]: updatedUser._id,
			};
		} else {
			itemQuery.$pull[itemListName] = updatedUser._id;
		}

		const updatedItem = await model.findByIdAndUpdate(
			itemExists._id,
			itemQuery,
			{
				new: true,
			}
		);

		//send updated user to source
		if (req.body.internalRequest) {
			return {
				status: "success",
				data: { user: updatedUser, sourceItem: updatedItem },
			};
		} else {
			res.status(200).json({
				status: "success",
				data: { user: updatedUser, sourceItem: updatedItem },
			});
		}
	} catch (error) {
		console.log(error);
		if (req.body.internalRequest) {
			throw error;
		} else {
			return next(
				new AppError(
					`Error removing item from user list: ${error.message}`,
					error.statusCode || 500
				)
			);
		}
	}
};

//Get user's socials list (friends || groups || pages || friendRequests)
exports.getSocialsList = catchAsync(async function (req, res, next) {
	const listName = req.query?.listName;

	if (listName) {
		//check query listName provided
		if (
			req.user[req.query.listName] === undefined ||
			!req.query.listName.endsWith("List")
		) {
			return next(new AppError("Invalid list name.", 400));
		}
		const socialType = listName.slice(0, -4); //friends || gorups || pages || friendRequests string
		const modelBySocialType = {
			friends: User,
			groups: Group,
			pages: Page,
			friendRequests: User,
		};
		const model = modelBySocialType[socialType]; //User || Group || Page model
		//fetch data
		const listAgg = getListAgg(req.user, listName, model);
		let socials = await User.aggregate(listAgg);

		console.log(socials);

		//filter data according to search value
		if (req.query.searchString) {
			const itemPropName = listName.slice(0, -5);
			socials = socials.filter((item) =>
				item[itemPropName].name
					.toLowerCase()
					.includes(req.query.searchString.toLowerCase())
			);
		}

		//return and send response
		return res.status(200).json({
			status: "success",
			data: socials,
		});
	}
	return next(new AppError("Please provide a query listName.", 400));
});

//Get user socials suggestions
//TODO: add indexes (if possible) to 3 models that match this function's search
exports.mySuggestions = catchAsync(async function (req, res, next) {
	const { _id, friendsList, groupsList, pagesList, friendRequestsList } =
		req.user;
	const pageNumber = req.query.page || 1;
	const pageSize = 20;

	const { friends, groups, pages } = req.body.excludeArrays;

	const filter = {
		friends: [
			_id,
			...friendsList.map((item) => item?.friend),
			...friends,
			...friendRequestsList.map((item) => item?.friendRequest),
		],
		groups: [...groupsList.map((item) => item?.group), ...groups],
		pages: [...pagesList.map((item) => item?.page), ...pages],
	};

	const friendsAggregation = suggestionAgg(
		[...filter.friends],
		User,
		friendsList,
		pageNumber,
		pageSize
	);
	const friendsSuggestions = await User.aggregate(friendsAggregation);

	const groupsAggregation = suggestionAgg(
		[...filter.groups],
		Group,
		friendsList,
		pageNumber,
		pageSize
	);
	const groupsSuggestions = await Group.aggregate(groupsAggregation);

	const pagesAggregation = suggestionAgg(
		[...filter.pages],
		Page,
		friendsList,
		pageNumber,
		pageSize
	);
	const pagesSuggestions = await Page.aggregate(pagesAggregation);

	res.status(200).json({
		status: "success",
		data: {
			friends: {
				numOfResults: friendsSuggestions.length,
				lastItemIndex: (pageNumber - 1) * pageSize,
				suggestionItems: friendsSuggestions,
				removedSuggestions: filter.friends.map((item) => item.toString()),
			},
			groups: {
				numOfResults: groupsSuggestions.length,
				lastItemIndex: (pageNumber - 1) * pageSize,
				suggestionItems: groupsSuggestions,
				removedSuggestions: filter.groups.map((item) => item.toString()),
			},
			pages: {
				numOfResults: pagesSuggestions.length,
				lastItemIndex: (pageNumber - 1) * pageSize,
				suggestionItems: pagesSuggestions,
				removedSuggestions: filter.pages.map((item) => item.toString()),
			},
		},
	});
});

//Send friend request
exports.sendFriendRequest = catchAsync(async function (req, res, next) {
	//check attempt to self request
	if (req.user?._id?.toString() === req.params.id?.toString()) {
		return next(
			new AppError("You cannot send friend request to yourself.", 400)
		);
	}

	//check if already friends with target id
	if (
		req.user.friendsList.some(
			(item) => item.friend?.toString() === req.params.id.toString()
		)
	) {
		return next(new AppError("This user is already your friend.", 400));
	}

	try {
		const sendingUserQuery = {
			friendRequest: req.params.id,
			connection: {
				status: "pending",
				timestamp: Date.now(),
			},
		};

		const receivingUserQuery = {
			friendRequest: req.user._id,
			connection: {
				status: "awaiting response",
				timestamp: Date.now(),
			},
		};

		req.body.list = "friendRequestsList";
		req.body.itemId = req.params.id;
		req.body.internalRequest = true;
		req.senderQuery = sendingUserQuery;
		req.receiverQuery = receivingUserQuery;

		//add friend requests to both users lists
		const response = await exports.addListItem(req, res, next);

		const updatedFriendRequestsList = response.data.user.friendRequestsList;

		//populate friend requests list
		const populatedList = await User.populate(updatedFriendRequestsList, {
			path: "friendRequest",
			select: "_id fullName profilePicture",
			transform: (doc) => ({ ...doc._doc, name: doc.fullName }),
		});

		//send response
		res.status(200).json({
			status: "success",
			data: { updatedFriendRequestsList: populatedList },
		});
	} catch (err) {
		console.log(err);
		return next(
			new AppError(
				`Error sending friend request: ${err.message}`,
				err.statusCode || 500
			)
		);
	}
});

//Reject friend request
exports.rejectFriendRequest = catchAsync(async function (req, res, next) {
	//check if has friend request from target id and its status is awaiting response
	if (
		!req.user.friendRequestsList.some(
			(item) =>
				item.friendRequest?.toString() === req.params.id.toString() &&
				item.connection?.status === "awaiting response"
		)
	) {
		return next(
			new AppError(
				"You dont have pending friend request from target user.",
				400
			)
		);
	}

	try {
		req.body.list = "friendRequestsList";
		req.body.itemId = req.params.id;
		req.body.internalRequest = true;

		//remove friend requests from both users lists
		const response = await exports.removeListItem(req, res, next);

		const updatedFriendRequestsList = response.data.user.friendRequestsList;

		//populate friend requests list
		const populatedList = await User.populate(updatedFriendRequestsList, {
			path: "friendRequest",
			select: "_id fullName profilePicture",
			transform: (doc) => ({ ...doc._doc, name: doc.fullName }),
		});

		//send response
		res.status(200).json({
			status: "success",
			data: { updatedFriendRequestsList: populatedList },
		});
	} catch (err) {
		console.log(err);
		return next(
			new AppError(
				`Error rejecting friend request: ${err.message}`,
				err.statusCode || 500
			)
		);
	}
});

//Accept friend request
exports.acceptFriendRequest = catchAsync(async function (req, res, next) {
	//check if has friend request from target id and its status is awaiting response
	if (
		!req.user.friendRequestsList.some(
			(item) =>
				item.friendRequest?.toString() === req.params.id.toString() &&
				item.connection?.status === "awaiting response"
		)
	) {
		return next(
			new AppError(
				"You dont have pending friend request from target user.",
				400
			)
		);
	}

	try {
		req.body.list = "friendsList";
		req.body.itemId = req.params.id;
		req.body.internalRequest = true;

		//add both users as friends
		const response = await exports.addListItem(req, res, next);

		req.body.list = "friendRequestsList";

		//remove friend requests from both users lists
		const updatedResponse = await exports.removeListItem(req, res, next);

		//populate friends list
		const updatedFriendsList = await User.populate(
			updatedResponse.data.user.friendsList,
			{
				path: "friend",
				select: "_id fullName profilePicture",
				transform: (doc) => ({ ...doc._doc, name: doc.fullName }),
			}
		);

		//populate friend requests list
		const updatedFriendRequestsList = await User.populate(
			updatedResponse.data.user.friendRequestsList,
			{
				path: "friendRequest",
				select: "_id fullName profilePicture",
				transform: (doc) => ({ ...doc._doc, name: doc.fullName }),
			}
		);

		//send response
		res.status(200).json({
			status: "success",
			data: {
				updatedFriendsList,
				updatedFriendRequestsList,
			},
		});
	} catch (err) {
		console.log(err);
		return next(
			new AppError(
				`Error accepting friend request: ${err.message}`,
				err.statusCode || 500
			)
		);
	}
});