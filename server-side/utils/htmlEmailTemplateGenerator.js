const buildTemplate = function (
	header = "",
	name = "",
	buttonText = "",
	buttonURL = "",
	message = ""
) {
	// 	const htmlContent = `
	//     <!DOCTYPE html>
	// <html lang="en">
	// <head>
	// <meta charset="UTF-8">
	// <meta name="viewport" content="width=device-width, initial-scale=1.0">
	// <style>
	// body {
	//     font-family: Arial, sans-serif;
	//     margin: 0;
	//     padding: 20px;
	//     background-color: #f4f4f4;
	//     color: #333;
	// }
	// .container {
	//         max-width: 600px;
	//         margin: 20px auto;
	//         padding: 20px;
	//         background-color: #fff;
	//         border-radius: 5px;
	//         box-shadow: 0 0 10px rgba(0,0,0,0.1);
	//     }
	//     h1 {
	//         color: #007bff;
	//     }
	//     p {
	//         margin: 20px 0;
	//     }
	//     .button {
	//         display: inline-block;
	//         padding: 10px 20px;
	//         color: #fff;
	//         background-color: #007bff;
	//         border-radius: 5px;
	//         text-decoration: none;
	//         font-weight: bold;
	//     }
	//     </style>
	//     </head>
	//     <body>
	//     <div class="container">
	//     <h1>${header}</h1>
	//     <p>Hi ${name || "there"},</p>
	//     <p>${message}</p>
	//     ${
	// 			buttonText &&
	// 			buttonURL &&
	// 			`<p><a href="${buttonURL}" class="button">${buttonText}</a></p>`
	// 		}
	//     <p>If you did not made this request, please ignore this email.</p>
	//     </div>
	//     </body>
	//     </html>
	//     `;

	const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap" rel="stylesheet">
<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
}
.container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1, p {
        font-family: 'Roboto', sans-serif;
    }
    h1 {
        color: #007bff;
    }
    p {
        margin: 20px 0;
        font-size: 16px;
    }
    span {
        font-weight: 600;
    }
    .button {
        display: inline-block;
        padding: 10px 20px;
        color: #fff;
        background-color: #007bff;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
    }
    </style>
    </head>
    <body>
    <div class="container">
    <h1>${header}</h1>
    <p>Hi ${name || "there"},</p>
    <p>${message}</p>
    ${
			buttonText &&
			buttonURL &&
			`<p><a href="${buttonURL}" class="button">${buttonText}</a></p>`
		}
    <p>If you did not made this request, please ignore this email.</p>
    <p>Thanks, the Neural Networking app.</p>
    </div>
    </body>
    </html>
    `;

	return htmlContent;
};

module.exports = buildTemplate;
