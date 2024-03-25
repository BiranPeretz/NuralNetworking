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

exports.indexedTextSearch = async function (
	Model,
	str,
	page = 1,
	limit = 5,
	select = ""
) {
	try {
		let isNoMoreItems = true;
		const skip = (page - 1) * limit;

		let results = await Model.find(
			{ $text: { $search: str } },
			{ score: { $meta: "textScore" } }
		)
			.sort({ score: { $meta: "textScore" } })
			.skip(skip)
			.limit(limit + 1)
			.select(select);

		if (results?.length === limit + 1) {
			results = results?.slice(0, -1);
			isNoMoreItems = false;
		}

		return { page, limit, isNoMoreItems, results };
	} catch (error) {
		throw error;
	}
};
