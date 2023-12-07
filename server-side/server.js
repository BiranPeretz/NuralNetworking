const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Catch app-wide uncaught exceptions
process.on("uncaughtException", (err) => {
	console.log("Uncaught exception...");
	console.log(err.name, err.message);
	process.exit(1);
});

//configure .env
dotenv.config({ path: "./config.env" });

const app = require("./app");

//Connect to database
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true, //TODO: add/remove parameters after reading docs
	})
	.then(() => console.log("DB connection successful!"));

//backup default port
const port = process.env.PORT || 4000;

//Run server
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

//Catch app-wide unhandled rejections
process.on("unhandledRejection", (err) => {
	console.log("Unhandled rejection...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
