const getListAgg = function (requestingUser, listName, model) {
	const socialType = listName.slice(0, -5); //friend || group || page

	const aggregationPipeline = [
		{
			//match the requesting user
			$match: { _id: requestingUser._id },
		},
		{
			//include only relevant list and prepare for population
			$project: {
				_id: 0,
				[`${listName}`]: 1,
				items: {
					//extract the nested doc from desirable list
					$map: {
						input: `$${listName}`,
						as: "item",
						in: `$$item.${socialType}`,
					},
				},
			},
		},
		{
			//populate docs
			$lookup: {
				from: `${model.collection.name}`,
				localField: "items",
				foreignField: "_id",
				as: "items",
			},
		},
		{
			//include only relevant props from populated docs
			$project: {
				[`${listName}`]: 1,
				items: {
					_id: 1,
					fullName: 1,
					name: 1,
					profilePicture: 1,
				},
			},
		},
		{
			$addFields: {
				//merge populated docs to their original path
				[`${listName}`]: {
					$map: {
						input: `$${listName}`,
						as: `${socialType}Item`,
						in: {
							$let: {
								vars: {
									matchedItem: {
										$arrayElemAt: [
											{
												$filter: {
													input: "$items",
													as: "populatedItem",
													cond: {
														$eq: [
															"$$populatedItem._id",
															`$$${socialType}Item.${socialType}`,
														],
													},
												},
											},
											0,
										],
									},
								},
								in: {
									$mergeObjects: [
										`$$${socialType}Item`,
										{
											[`${socialType}`]: {
												$mergeObjects: [
													{
														name: {
															//standardize "name" property
															$ifNull: [
																"$$matchedItem.fullName",
																"$$matchedItem.name",
															],
														},
													},

													"$$matchedItem",
												],
											},
										},
									],
								},
							},
						},
					},
				},
			},
		},
		{ $unwind: `$${listName}` }, //unwind docs
		{ $replaceRoot: { newRoot: `$${listName}` } }, //remove unnecessary parent root
		{ $sort: { [`${socialType}.name`]: 1 } }, //sort by nested "name" prop
	];

	return aggregationPipeline;
};

module.exports = getListAgg;
