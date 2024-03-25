const axios = require("axios");
const generateTemplate = require("../utils/htmlEmailTemplateGenerator");

const sendEmail = async ({
	to,
	header = "",
	name = "",
	buttonText = "",
	buttonURL = "",
	message = "",
}) => {
	const htmlContent = generateTemplate(
		header,
		name,
		buttonText,
		buttonURL,
		message
	);

	const params = new URLSearchParams();
	params.append("apikey", process.env.ELASTIC_EMAIL_API_KEY);
	params.append("subject", `${header} from Neural Networking`);
	params.append("from", "dev.neuralnetworking@gmail.com");
	params.append("fromName", "Neural Networking");
	params.append("to", to);
	params.append("bodyHtml", htmlContent);
	params.append("isTransactional", "true");

	try {
		const response = await axios.post(
			"https://api.elasticemail.com/v2/email/send",
			params.toString(),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		if (!response.data.success) {
			throw new Error(response.data.error);
		}
		console.log("Email sending response:", response.data);
	} catch (error) {
		console.error(
			"Failed to send email:",
			error.response ? error.response.data : error.message
		);
		throw error;
	}
};

module.exports = sendEmail;
