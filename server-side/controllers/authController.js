const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const testSendEmail = require("../utils/testSendEmail");
const sendEmail = require("../utils/sendEmail");
const filterObjProperties = require("../utils/filterObjProperties");

//Create JWT token by id
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

//Create auth token with defined user parameter and send detailed response with statusCode parameter
//TODO: decide about cookie related code and if using or not
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	console.log(`FROM CREATESENDTOKEN, JWT TOKEN:${token}`); //TODO: delete me
	const cookieOptions = {
		//Define token cookie properties
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token, cookieOptions); //Send cookie with response

	user.password = undefined; // Remove password from output

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

//New user signup, request body properties limited for user creation related only
exports.signup = catchAsync(async function (req, res, next) {
	const filteredBody = filterObjProperties(
		req.body,
		"email",
		"password",
		"passwordConfirm",
		"fullName",
		"profilePicture",
		"about"
	);

	const user = await User.create(filteredBody);

	createSendToken(user, 201, res);
});

//Login existing user if credentials match
exports.login = catchAsync(async function (req, res, next) {
	//Check if email and password
	console.log(req.body.email);
	console.log(req.body.password);
	if (!req.body.email || !req.body.password) {
		return next(new AppError("Please provide both email and password.", 400));
	}
	//Fetch user by email and check if user and if correct password
	const user = await User.findOne({ email: req.body.email }).select(
		"+password"
	);
	console.log(user);
	if (
		!user ||
		!(await user.correctPassword(req.body.password, user.password))
	) {
		return next(new AppError("Incorrect email or password.", 401));
	}

	//Create and send token
	createSendToken(user, 200, res);
});

//Create reset token for user who forgot hes password and send email
exports.forgotPassword = catchAsync(async function (req, res, next) {
	const email = req.body.email;
	//get the user via requested email and check if user
	const user = await User.findOne({ email });
	if (!user) {
		return next(new AppError("There is no user with that email.", 404));
	}

	if (!user.verifiedEmail) {
		return next(
			new AppError("Email must be varified to use this feature.", 403)
		);
	}

	//create reset password token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const message = `A password reset request for your account was received. Please use the token provided below to proceed with resetting your password.<br><br>Token: <br><span>${resetToken}</span><br><br>Enter this token in the specified field along with your new password.`;

	try {
		sendEmail({
			to: user.email,
			header: "Password Reset Request",
			message,
		})
			.then(() => {
				console.log("Send email attempted.");
			})
			.catch((error) => {
				console.error("Send email failed:", error);
			});

		res.status(200).json({
			status: "success",
			message: "Password reset mail has been sent to your email inbox.",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError(
				err?.message ||
					"There was an error sending email, please try again later.",
				err.statusCode || 500
			)
		);
	}
});

//Reset the user password via POSTed reset token
exports.resetPassword = catchAsync(async function (req, res, next) {
	//find user by reset token and its validety
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	//check if user
	if (!user) {
		return next(
			new AppError("Invalid token or token time limit expired.", 400)
		);
	}
	console.log(user);
	//update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	//automatically encrypting password and setting passwordChangedAt before save
	await user.save();
	//log the user in and send auth token
	createSendToken(user, 200, res);
});

//Create reset token for user who forgot hes password and send email
exports.sendVerificationEmail = catchAsync(async function (req, res, next) {
	const email = req.body.email;
	//get the user via requested email and check if user
	const user = await User.findOne({ email });
	if (!user) {
		return next(new AppError("There is no user with that email.", 404));
	}

	//create email verification token
	const resetToken = user.createEmailVerificationToken();
	await user.save({ validateBeforeSave: false });

	const message = `A email verification request for your account was received. Please use the token provided below to proceed.<br><br>Token: <br><span>${resetToken}</span><br><br>Enter this token in the specified field.`;

	try {
		sendEmail({
			to: user.email,
			header: "Email Verification Request",
			message,
		})
			.then(() => {
				console.log("Send email attempted.");
			})
			.catch((error) => {
				console.error("Send email failed:", error);
			});

		res.status(200).json({
			status: "success",
			message: "Email verification mail has been sent to your email inbox.",
		});
	} catch (err) {
		user.emailVerificationToken = undefined;
		user.verificationTokenExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError(
				err?.message ||
					"There was an error sending email, please try again later.",
				err.statusCode || 500
			)
		);
	}
});

//Verify user's email via verification token
exports.verifyEmail = catchAsync(async function (req, res, next) {
	//find user by verification token and its validety
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		emailVerificationToken: hashedToken,
		verificationTokenExpires: { $gt: Date.now() },
	});
	//check if user
	if (!user) {
		return next(
			new AppError("Invalid token or token time limit expired.", 400)
		);
	}
	//update user's verification status
	user.verifiedEmail = true;
	user.emailVerificationToken = undefined;
	user.verificationTokenExpires = undefined;
	await user.save({ validateBeforeSave: false });

	res.status(200).json({
		status: "success",
		message: "The email has been verified successfully.",
	});
});

//General middleware to restrict some features for logged in users only
exports.protect = catchAsync(async function (req, res, next) {
	//Get and check if auth token
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return next(
			new AppError("You are not logged in, please log in to get access.", 401)
		);
	}

	//Check if valid JWT token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	//Check if user still exist
	const requestingUser = await User.findById(decoded.id);
	if (!requestingUser) {
		return next(new AppError("This user no longer exist!", 401));
	}
	//Check that the token was issued after the user last password change.
	if (requestingUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("User password changed recently, please log in again.", 401)
		);
	}
	//Access approved + save user details for later use
	req.user = requestingUser;
	next();
});
