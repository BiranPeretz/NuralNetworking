const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please specify the page name."],
		//TODO: add uniqe
	},
	profilePicture: {
		type: String,
		default: "https://randomuser.me/api/portraits/thumb/men/76.jpg", //TODO: change for real default
	},
	description: {
		type: String,
		maxlength: [200, "page description should not exceed 200 characters."],
		required: [true, "Please specify the page description."],
	},
	followersList: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
	ownerID: { type: mongoose.Schema.ObjectId, ref: "User" }, //Page creator/admin ID
});

//Deselect mongoDB's __v property
pageSchema.pre(/^find/, function () {
	this.select("-__v");
});

//more __v prop removal
pageSchema.post("save", function (doc, next) {
	if (doc.__v !== undefined) {
		delete doc._doc.__v;
	}
	next();
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
