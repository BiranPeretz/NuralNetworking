const Group = require("../models/groupModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const fetchNextBatch = require("../utils/fetchNextBatch");
const { addListItem } = require("./userController");
const { getAll, indexedTextSearch } = require("./CRUDOperations");
const {
	multerImageUpload,
	cloudinaryImageUpload,
} = require("./imageController");

//get all groups
exports.getAllGroups = getAll(Group);

//Create new group
exports.createGroup = catchAsync(async function (req, res, next) {
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

	//check if group name
	if (!req.body.name) {
		return next(new AppError("Please provide the group name.", 400));
	}

	//check if group description
	if (!req.body.description) {
		return next(new AppError("Please provide the group description.", 400));
	}

	//store name and description to filter array
	const filteredArray = ["name", "description"];
	//add pofilePicture to filteredArray if included in the request
	if (req.body.profilePicture) {
		filteredArray.push("profilePicture");
	}
	//filter req.body by filteredArray
	const filteredBody = filterObjProperties(req.body, ...filteredArray);

	//Set request sender as group admin
	filteredBody.adminID = req.user._id;

	//upload image to cloudinary and store image url
	let result;
	if (req.file) {
		try {
			req.body.type = "profilePicture";
			req.body.internalRequest = true;
			result = await cloudinaryImageUpload(req, res, next);
			filteredBody.profilePicture = result.url || "";
		} catch (err) {
			return next(
				new AppError(
					`Error uploading image to coudinary: ${err.message}`,
					err.statusCode || err.code || 500
				)
			);
		}
	}

	//try to create the group
	const group = await Group.create(filteredBody);

	let updateResponse;
	//try to add the group to the user's groups list
	try {
		req.body.list = "groupsList";
		req.body.itemId = group?._id;
		req.body.internalRequest = true;

		updateResponse = await addListItem(req, res, next);
	} catch (err) {
		//linkage faield, delete created group
		if (group) {
			await Group.findByIdAndDelete(group._id);
		}
		return next(
			new AppError(
				`Error linking new group to user: ${err.message}`,
				err.statusCode || 500
			)
		);
	}

	//send created group
	res.status(201).json({
		status: "success",
		data: {
			group: updateResponse?.data?.sourceItem,
			user: updateResponse?.data?.user,
		},
	});
});

//Search groups by string using text index
exports.searchGroupsByName = catchAsync(async function (req, res, next) {
	try {
		const { value, page, limit } = req?.query;
		//check if valid value
		if (typeof value !== "string") {
			return next(new AppError("Please provide an valid string value.", 400));
		}

		//search groups
		const results = await indexedTextSearch(
			Group,
			value,
			parseInt(page, 10) || 1,
			parseInt(limit, 10) || 5,
			"_id name profilePicture"
		);

		//if return value is not an array throw an error
		if (!Array.isArray(results?.results)) {
			throw new AppError("An error occured during the search.");
		}

		//send response
		res.status(200).json({
			status: "success",
			data: results,
		});
	} catch (err) {
		return next(
			new AppError(
				`Error searching groups: ${err.message}`,
				err.statusCode || 500
			)
		);
	}
});
