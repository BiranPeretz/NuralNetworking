const AppError = require("../utils/appError");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

//multer setup
const upload = multer({ dest: "uploads/" }).single("image");

//multer image upload and error handling
exports.multerImageUpload = (req, res) => {
	return new Promise((resolve, reject) => {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				reject(
					new AppError(
						`Error uploading image with multer: ${err.message}`,
						err.code || 400
					)
				);
			} else if (err) {
				reject(new AppError(err.message, err.code || 500));
			} else {
				resolve(req.file); // Resolve with the file info
			}
		});
	});
};

//cloudinary image upload and local file deletion
exports.cloudinaryImageUpload = async function (req, res, next) {
	try {
		//if no file was uploaded with multer
		if (!req.file) {
			throw new AppError("No file was uploaded.", 400);
		}

		//if request body is missing the image type
		if (
			!req.body.type ||
			(req.body.type !== "profilePicture" && req.body.type !== "postImage")
		) {
			throw new AppError(
				`Invalid type, must be "profilePicture" or "postImage".`,
				400
			);
		}

		//define cloudinary options object
		let cloudinaryOptionsObj;
		if (req.body.type === "profilePicture") {
			cloudinaryOptionsObj = {
				folder: "NeuralNetworking/icon",
				width: 100,
				height: 100,
				crop: "fill",
				radius: "max",
			};
		} else {
			cloudinaryOptionsObj = {
				folder: "NeuralNetworking/image",
				width: 800,
				crop: "fit",
				quality: "auto:good",
				fetch_format: "auto",
			};
		}

		//upload to cloudinary
		const result = await cloudinary.uploader.upload(
			req.file.path,
			cloudinaryOptionsObj
		);

		//delete local file
		await fs.promises.unlink(req.file.path);

		//if internal request (sent by another controller)
		if (req.body.internalRequest) {
			return result;
		} else {
			//send response
			res.status(200).json({
				status: "success",
				data: { imageURL: result.url },
			});
		}

		// //////////////////////////////////////////////
		// upload(req, res, function (err) {
		// 	if (err instanceof multer.MulterError) {
		// 		return next(new AppError(`Multer error: ${err.message}`, 400));
		// 	} else if (err) {
		// 		return next(new AppError(`Upload error: ${err.message}`, 500));
		// 	}

		// 	if (
		// 		!req.body.type ||
		// 		(req.body.type !== "profilePicture" && req.body.type !== "postImage")
		// 	) {
		// 		return next(
		// 			new AppError(
		// 				`Invalid type, must be "profilePicture" or "postImage".`,
		// 				400
		// 			)
		// 		);
		// 	}

		// 	let cloudinaryOptionsObj;

		// 	if (req.body.type === "profilePicture") {
		// 		cloudinaryOptionsObj = {
		// 			folder: "NeuralNetworking/icon",
		// 			width: 100,
		// 			height: 100,
		// 			crop: "fill",
		// 			radius: "max",
		// 		};
		// 	} else {
		// 		cloudinaryOptionsObj = {
		// 			folder: "NeuralNetworking/image",
		// 			width: 800,
		// 			crop: "fit",
		// 			quality: "auto:good",
		// 			fetch_format: "auto",
		// 		};
		// 	}

		// 	cloudinary.uploader.upload(
		// 		req.file.path,
		// 		cloudinaryOptionsObj,
		// 		(cloudinaryErr, result) => {
		// 			if (cloudinaryErr) {
		// 				return next(
		// 					new AppError(`Cloudinary error: ${cloudinaryErr.message}`, 500)
		// 				);
		// 			}

		// 			fs.unlink(req.file.path, (fsErr) => {
		// 				if (fsErr) {
		// 					console.error(`Error deleting file: ${fsErr.message}`);
		// 				}
		// 			});
		// 			if (req.isInternal) {
		// 				return result;
		// 			} else {
		// 				res.status(200).json({
		// 					message: "File uploaded successfully",
		// 					imageUrl: result.url,
		// 				});
		// 			}
		// 		}
		// 	);
		// });
	} catch (error) {
		console.log(error);
		//if internal request throw the error to calling function
		if (req.body.internalRequest) {
			throw error;
		} else {
			//send the error response
			return next(
				new AppError(
					`Error adding item to user list: ${error.message}`,
					error.statusCode || error.code || 500
				)
			);
		}
	}
};
