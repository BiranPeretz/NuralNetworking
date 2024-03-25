const nodemailer = require("nodemailer");

const testSendEmail = async function (options) {
	//create transporter
	const transporter = nodemailer.createTransport({
		host: process.env.MAILTRAP_EMAIL_HOST,
		port: process.env.MAILTRAP_EMAIL_PORT,
		auth: {
			user: process.env.MAILTRAP_EMAIL_USERNAME,
			pass: process.env.MAILTRAP_EMAIL_PASSWORD,
		},
	});

	//define email options
	const mailOptions = {
		from: "Jhon doe <jhon@jhon.io>",
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	};

	//send email
	await transporter.sendMail(mailOptions);
};

module.exports = testSendEmail;
