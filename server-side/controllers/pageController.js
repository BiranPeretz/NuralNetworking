const Page = require("../models/pageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObjProperties = require("../utils/filterObjProperties");
const fetchNextBatch = require("../utils/fetchNextBatch");
const { addListItem } = require("./userController");
const CRUDOperations = require("./CRUDOperations");

//get all pages
exports.getAllPages = CRUDOperations.getAll(Page);

//get all the pages owned by requseting user
exports.getMyPages = catchAsync(async function (req, res, next) {
	//store requesting user's pages list as array
	const pagesArr = req.user?.pagesList?.map((page) => page?.page.toString());

	//find all pages owned by requesting user
	const myPages = await Page.find({
		_id: { $in: pagesArr },
		ownerID: req.user._id.toString(),
	}).select("_id name profilePicture");

	//send response
	res.status(200).json({
		status: "success",
		data: { myPages },
	});
});

//Create new page
exports.createPage = catchAsync(async function (req, res, next) {
	//filter request's body properties
	const filteredBody = filterObjProperties(
		req.body,
		"name",
		"profilePicture",
		"description"
	);

	//Set request sender as page owner
	filteredBody.ownerID = req.user._id;
	const page = await Page.create(filteredBody);

	let updateResponse;
	//try to add the page to the user's pages list
	try {
		req.body.list = "pagesList";
		req.body.itemId = page?._id;
		req.body.internalRequest = true;

		updateResponse = await addListItem(req, res, next);
	} catch (err) {
		//linkage faield, delete created page
		if (page) {
			await Page.findByIdAndDelete(page._id);
		}
		return next(
			new AppError(
				`Error linking new page to user: ${err.message}`,
				err.statusCode || 500
			)
		);
	}
	console.log("UPDATE RESPONSE", updateResponse);

	//send created page
	res.status(201).json({
		status: "success",
		data: {
			page: updateResponse?.data?.sourceItem,
			user: updateResponse?.data?.user,
		},
	});
});
