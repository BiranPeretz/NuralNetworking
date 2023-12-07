//Build and return the data aggregation for suggesting social items for users according to this application suggesting algorithm
const suggestionAgg = function (
	excludeArr, //array of items to exclude from suggestions (already connected / removed items)
	model,
	userFriendsList, //requesting user's friendsList
	pageNumber,
	pageSize
) {
	const collectionName = model.collection.name; //users | groups | pages

	let listName; //friendsList | membersList | followersList
	let idField; //path to _id in suggestion instance
	let namePropHolder; //path to name of the instance

	switch (collectionName) {
		case "users":
			listName = "friendsList";
			idField = "$$connection.friend";
			namePropHolder = "fullName";
			break;
		case "groups":
			listName = "membersList";
			idField = "$$connection";
			namePropHolder = "name";
			break;
		case "pages":
			listName = "followersList";
			idField = "$$connection";
			namePropHolder = "name";
			break;
		default:
			throw new Error("Invalid model name");
	}

	console.log("excludeArr:", excludeArr);
	const usersFriendsIdsList = userFriendsList.map((item) => item?.friend);

	const aggregationPipeline = [
		{ $match: { _id: { $nin: excludeArr } } }, //match all items of the collection excluding excludeArr items
		{
			$addFields: {
				mutualCount: {
					//number of user's friends connected with suggested item
					$size: {
						$filter: {
							input: `$${listName}`,
							as: "connection",
							cond: { $in: [idField, usersFriendsIdsList] },
						},
					},
				},
				popularity: { $size: `$${listName}` }, //number of traffic
				createdAt: { $toDate: "$_id" }, //date of item creation
			},
		},
		{
			$project: {
				//only return front-end required fields
				_id: 1,
				name: { $ifNull: ["$name", "$fullName"] },
				profilePicture: 1,
				mutualCount: 1,
				popularity: 1,
				createdAt: 1,
			},
		},
		{ $sort: { mutualCount: -1, popularity: -1, createdAt: -1 } }, //sorting/ranking according to app's algorithm
		{ $skip: (pageNumber - 1) * pageSize },
		{ $limit: pageSize },
	];

	return aggregationPipeline;
};

module.exports = suggestionAgg;
