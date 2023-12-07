const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	content: {
		//Post image and text with default values
		_id: false,
		type: {
			image: {
				type: String,
				default: "",
			},
			text: {
				type: String,
				maxlength: [400, "Post body cannot exceed 400 characters."],
				validate: [
					(value) => value.replace(/\s+/g, ""),
					"Post content must contain some text.",
				], //not white-space only string.

				required: [true, "Post content cannot be empty."],
			},
		},
		default: {
			image: "",
		},
	},
	timestamp: { type: Date, default: Date.now }, //Posting timestamp
	creatorType: {
		type: String,
		enum: ["User", "Group", "Page"],
		required: [true, "Post must contain an valid creator type."],
	},
	creatorID: {
		//ID of post creator according to this.creatorType
		type: mongoose.Schema.ObjectId,
		refPath: "creatorType",
		required: [true, "Post must contain creator ID."],
		autopopulate: { select: "_id fullName name profilePicture" },
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		autopopulate: { select: "_id fullName profilePicture" },
	}, //The post creator (for groups and pages posts)
	likeList: [
		{
			_id: false,
			user: {
				type: mongoose.Schema.ObjectId,
				ref: "User",
				autopopulate: { select: "_id fullName" },
			},
			timestamp: { type: Date, default: Date.now },
		},
	],
	commentsList: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Comment",
			autopopulate: {
				select: "_id postID userID content timestamp childCommentIDs",
			},
		},
	],
});

postSchema.plugin(require("mongoose-autopopulate"));

//Deselect mongoDB's __v property
postSchema.pre(/^find/, function () {
	this.select("-__v");
});

//more __v prop removal
postSchema.post("save", function (doc, next) {
	if (doc.__v !== undefined) {
		delete doc._doc.__v;
	}
	next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
