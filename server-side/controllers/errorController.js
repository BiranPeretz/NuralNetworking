const AppError = require("./../utils/appError");

const handleCastErrorDB = function (err) {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
	let field = Object.keys(err.keyPattern)[0];
	let message = `This ${field} is already taken, Please choose a different ${field}.`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data: ${errors.join("\n")}`;
	return new AppError(message, 400);
};

const handleJWTError = function () {
	new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = function () {
	new AppError("Your token has expired! Please log in again.", 401);
};

const sendErrorDev = function (err, res) {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = function (err, res) {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});

		// Programming or other unknown error: don't leak error details
	} else {
		// 1) Log error
		console.error("Error occurred", err);

		// 2) Send generic message
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};

module.exports = function (err, req, res, next) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;
		if (err.name === "CastError") error = handleCastErrorDB(error);
		if (err.code === 11000) error = handleDuplicateFieldsDB(error);
		if (err.name === "ValidationError") error = handleValidationErrorDB(error);
		if (err.name === "JsonWebTokenError") error = handleJWTError();
		if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
		sendErrorProd(error, res);
	}
};
