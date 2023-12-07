const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	postID: {
		type: mongoose.Schema.ObjectId,
		ref: "Post",
		required: [true, "Comment must contain it's post ID."],
	},
	userID: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "Comment must contain it's user ID."],
		autopopulate: { select: "_id fullName profilePicture" },
	},
	content: {
		type: String,
		maxlength: [200, "Comment cannot exceed 200 characters."],
		required: [true, "Comment must contain some text."],
	},
	timestamp: { type: Date, default: Date.now }, //Comment posting timestamp
	parentCommentID: {
		//ID of parent comment, undefined for top level comments (i.e. not a reply but direct comment on a post).
		type: mongoose.Schema.ObjectId,
		ref: "Comment",
	},
	childCommentIDs: [
		//IDs array of child comments(replies), undefined for lowest level comments (i.e. no replies for this comment).
		{
			type: mongoose.Schema.ObjectId,
			ref: "Comment",
			autopopulate: {
				select: "_id postID userID content timestamp childCommentIDs",
			},
		},
	],
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
});

commentSchema.plugin(require("mongoose-autopopulate"));

//Deselect mongoDB's __v property
commentSchema.pre(/^find/, function () {
	this.select("-__v");
});

//more __v prop removal
commentSchema.post("save", function (doc, next) {
	if (doc.__v !== undefined) {
		delete doc._doc.__v;
	}
	next();
});

//Standardize auto-populated userID's 'fullName' property to 'name'
commentSchema.set("toJSON", {
	transform: function (doc, ret, options) {
		if (ret.userID && ret.userID.fullName) {
			ret.userID.name = ret.userID.fullName;
			delete ret.userID.fullName;
		}
		return ret;
	},
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
