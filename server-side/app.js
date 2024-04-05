const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const groupRouter = require("./routes/groupRoutes");
const pageRouter = require("./routes/pageRoutes");
const commentRouter = require("./routes/commentRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const imageRouter = require("./routes/imageRoutes");

const app = express();

const authorizedOrigins = [
	"http://localhost:5173",
	"http://localhost:4173",
	"https://nuralnetworking.onrender.com",
];
const corsOptions = {
	origin: function (origin, callback) {
		if (authorizedOrigins.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new AppError("Not allowed by CORS", 403));
		}
	},
};

// Set up cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Development logging with morgan
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Limit requests
const limiter = rateLimit({
	max: 300,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
	hpp({
		whitelist: [],
	})
);

//Routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/groups", groupRouter);
app.use("/pages", pageRouter);
app.use("/comments", commentRouter);
app.use("/notifications", notificationRouter);
app.use("/images", imageRouter);

//Catch unspecified routes
app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handling
app.use(globalErrorHandler);

module.exports = app;
