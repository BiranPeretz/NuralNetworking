//generic infinite-scroll pagination function
const fetchNextBatch = async (req, model, baseQuery = {}, sort) => {
	const limit = parseInt(req.query.limit, 10) || 5; // amount of items per batch
	const lastItemTimestamp = req.query.lastItemTimestamp; // ID of the last item fetched
	let updatedLastItemTimestamp;
	let query = model.find(baseQuery);

	//if sort, add it to the query
	if (sort) {
		query.sort(sort);
	}

	// if lastItemTimestamp, current batch start after it
	if (lastItemTimestamp) {
		query = query.where("timestamp").lt(lastItemTimestamp);
	}

	const results = await query.limit(limit);
	if (results.length > 0) {
		updatedLastItemTimestamp = results[results.length - 1].timestamp;
	}

	return {
		status: "success",
		isNoMoreItems: results.length < limit,
		lastItemTimestamp: updatedLastItemTimestamp?.toISOString(),
		data: results,
	};
};

module.exports = fetchNextBatch;
