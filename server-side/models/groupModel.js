const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please specify the group name."],
		//TODO: add uniqe
	},
	profilePicture: {
		type: String,
		default: "https://randomuser.me/api/portraits/thumb/men/76.jpg", //TODO: change for real default
	},
	description: {
		type: String,
		maxlength: [200, "Group description should not exceed 200 characters."],
		required: [true, "Please specify the group description."],
	},
	membersList: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
	adminID: { type: mongoose.Schema.ObjectId, ref: "User" }, //Group creator/admin ID
});

//Deselect mongoDB's __v property
groupSchema.pre(/^find/, function () {
	this.select("-__v");
});

//more __v prop removal
groupSchema.post("save", function (doc, next) {
	if (doc.__v !== undefined) {
		delete doc._doc.__v;
	}
	next();
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
