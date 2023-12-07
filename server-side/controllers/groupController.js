const Group = require("../models/groupModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const fetchNextBatch = require("../utils/fetchNextBatch");
const { addListItem } = require("./userController");
const CRUDOperations = require("./CRUDOperations");

//get all groups
exports.getAllGroups = CRUDOperations.getAll(Group);

//Create new group
exports.createGroup = catchAsync(async function (req, res, next) {
	//filter request's body properties
	const filteredBody = filterObjProperties(
		req.body,
		"name",
		"profilePicture",
		"description"
	);

	//Set request sender as group admin
	filteredBody.adminID = req.user._id;
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
