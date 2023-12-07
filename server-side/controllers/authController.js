const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
	//get the user via requested id and check if user
	const user = await User.findOne({ email });
	if (!user) {
		return next(new AppError("There is no user with that email.", 404));
	}
	console.log(user);
	//create reset password token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	//send reset token to the user via email (if dummy/self created user)
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/users/resetPassword/${resetToken}`;

	//TODO: 1)change name to app's name 2) change the message to html 3) use a button redirecting to password change page
	const message = `Hey there from the Neural Networking app. Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

	try {
		await sendEmail({
			email,
			subject: "Your password reset token (valid for 10 min)",
			message,
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
				"There was an error sending email, please try again later.",
				500
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
			new AppError("Invalid request or password reset time limit expired.", 400)
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
