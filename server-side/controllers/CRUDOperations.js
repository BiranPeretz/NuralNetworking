//basic CRUD operations for all models

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		let filter = {};
		if (req.filter) {
			filter = req.filter;
		}
		const documents = await Model.find(filter);

		res.status(200).json({
			status: "success",
			numOfResults: documents.length,
			data: {
				data: documents,
			},
		});
	});
