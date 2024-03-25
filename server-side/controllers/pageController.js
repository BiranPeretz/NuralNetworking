const Page = require("../models/pageModel");
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

//get all pages
exports.getAllPages = getAll(Page);

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

	//check if page name
	if (!req.body.name) {
		return next(new AppError("Please provide the page name.", 400));
	}

	//check if page description
	if (!req.body.description) {
		return next(new AppError("Please provide the page description.", 400));
	}

	//store name and description to filter array
	const filteredArray = ["name", "description"];
	//add pofilePicture to filteredArray if included in the request
	if (req.body.profilePicture) {
		filteredArray.push("profilePicture");
	}
	//filter req.body by filteredArray
	const filteredBody = filterObjProperties(req.body, ...filteredArray);

	//Set request sender as page owner
	filteredBody.ownerID = req.user._id;

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

	//try to create the page
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

	//send created page
	res.status(201).json({
		status: "success",
		data: {
			page: updateResponse?.data?.sourceItem,
			user: updateResponse?.data?.user,
		},
	});
});

//Search pages by string using text index
exports.searchPagesByName = catchAsync(async function (req, res, next) {
	try {
		const { value, page, limit } = req?.query;
		//check if valid value
		if (typeof value !== "string") {
			return next(new AppError("Please provide an valid string value.", 400));
		}

		//search pages
		const results = await indexedTextSearch(
			Page,
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
				`Error searching pages: ${err.message}`,
				err.statusCode || 500
			)
		);
	}
});
