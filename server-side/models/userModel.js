const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		maxlength: [40, "Full name should not exceed 40 characters."],
	},
	password: {
		type: String,
		required: [true, "Please provide a password."],
		minlength: [8, "Password should contain at least 8 characters."],
		select: false,
	},
	passwordConfirm: {
		//Internal useage only, deleted before save
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			//Validate passwordConfirm === password. only works for create and save
			validator: function (el) {
				if (el && this.password) return el === this.password;
			},
			message: "Passwords are not the same",
		},
	},
	email: {
		type: String,
		required: [true, "Please provide your email."],
		unique: [
			true,
			"This email is taken, use different email or login instead.",
		],
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email."], //email validation with validator.js
	},
	profilePicture: {
		type: String,
		default: "",
	},
	about: {
		type: String,
		maxlength: [100, "about section should not exceed 100 characters."],
	},
	verifiedEmail: {
		type: Boolean,
		default: false,
	},
	friendsList: [
		{
			friend: { type: mongoose.Schema.ObjectId, ref: "User" },
			connection: {
				status: { type: String, default: "accepted" },
				timestamp: { type: Date, default: Date.now },
			},
		},
	],
	groupsList: [
		{
			group: { type: mongoose.Schema.ObjectId, ref: "Group" },
			connection: {
				status: { type: String, default: "accepted" },
				timestamp: { type: Date, default: Date.now },
			},
		},
	],
	pagesList: [
		{
			page: { type: mongoose.Schema.ObjectId, ref: "Page" },
			connection: {
				status: { type: String, default: "accepted" },
				timestamp: { type: Date, default: Date.now },
			},
		},
	],
	friendRequestsList: [
		{
			friendRequest: { type: mongoose.Schema.ObjectId, ref: "User" },
			connection: {
				status: {
					type: String,
					enum: ["awaiting response", "pending", "accepted", "rejected"],
					required: [
						true,
						"User's friend request must contain the request status.",
					],
				},
				timestamp: { type: Date, default: Date.now },
			},
		},
	],
	myNotifications: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Notification",
		},
	],
	passwordChangedAt: Date, //Last password change
	passwordResetToken: String,
	passwordResetExpires: Date, //Password reset token expiration date
	emailVerificationToken: String,
	verificationTokenExpires: Date, //Email verification token expiration date
});

userSchema.plugin(require("mongoose-autopopulate"));

//Encrypt raw password before save
userSchema.pre("save", async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm field before DB save
	this.passwordConfirm = undefined;
	next();
});

//Check and set passwordChangeAt before save
userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();
	//If password was modified
	this.passwordChangedAt = Date.now() - 1000; //-1000 miliseconds to prevent JWT token created before passwordChangedAt
	next();
});

//Deselect mongoDB's __v property
userSchema.pre(/^find/, function () {
	this.select("-__v");
});

//more __v prop removal
userSchema.post("save", function (doc, next) {
	if (doc.__v !== undefined) {
		delete doc._doc.__v;
	}
	next();
});

//Validate user's raw password match encrypted
userSchema.methods.correctPassword = async function (rawPassword, encPassword) {
	return await bcrypt.compare(rawPassword, encPassword);
};

//Compare last password change with current token iat (issued at timestamp)
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

//Create password reset token and set 10 minutes expiration
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

//Create email verification token and set 24 hours expiration
userSchema.methods.createEmailVerificationToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.emailVerificationToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
