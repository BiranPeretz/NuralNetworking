//Both this file and authInputValidations functions can be refactored as general validation functions for better DRY

import type { validationResponse } from "../types/old-types/validations";

const fullNameValidation = function (fullName: string): string {
	if (fullName.length === 0) {
		return "Please enter your full name.";
	}
	if (!fullName.includes(" ")) {
		return "Please contain both first and last name.";
	}
	if (/^[a-zA-Z\s]+$/.test(fullName)) {
		return "Full name should only include alphabetic characters with space character.";
	}

	return "";
};

const ageValidation = function (age: number): string {
	if (age < 13) {
		return "Your need to be at least 13 to use this app.";
	}

	return "";
};

const picUrlValidation = function (picUrl: string): string {
	try {
		new URL(picUrl);
		return "";
	} catch (error) {
		if (error instanceof TypeError) return error.message;
		else return "Invalid profile pic URL.";
	}
};

export default function profileCreationValidation(
	fullName: string,
	age: number,
	picUrl: string
): validationResponse {
	const response: validationResponse = {
		success: false,
		message: "",
	};

	response.message = fullNameValidation(fullName);

	if (!response.message) {
		response.message = ageValidation(age);

		if (!response.message) {
			response.message = picUrlValidation(picUrl);

			if (!response.message) {
				response.success = true;
			}
		}
	}

	return response;
}
