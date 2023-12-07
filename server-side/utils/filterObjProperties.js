//Helper function to filter desirable properties only.
const filterObjProperties = function (obj, ...includeFields) {
	const filteredObj = {};
	for (let key in obj) {
		if (includeFields.includes(key)) filteredObj[key] = obj[key];
	}
	return filteredObj;
};

module.exports = filterObjProperties;
