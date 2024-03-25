import React from "react";
import classes from "./Error.module.css";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage: React.FC = function () {
	const error = useRouteError();
	let errorMessage: string;

	if (isRouteErrorResponse(error)) {
		console.log("cauth error of type ErrorResponse");
		errorMessage = error.error?.message || error.statusText;
	} else if (error instanceof Error) {
		console.log("cauth error with type that is an instance of Error");
		errorMessage = error.message;
	} else if (typeof error === "string") {
		console.log("cauth error of type string");
		errorMessage = error;
	} else {
		console.log("cauth error with unknown type");
		console.error(error);
		errorMessage = "Unknown error";
	}

	return (
		<div
			id="error-page"
			className="flex flex-col gap-8 justify-center items-center h-screen"
		>
			<h2 className="text-4xl font-bold">Oops!</h2>
			<p>Sorry, an unexpected error has occurred.</p>
			<p className="text-slate-400">
				<i>{errorMessage}</i>
			</p>
		</div>
	);
};

export default ErrorPage;
