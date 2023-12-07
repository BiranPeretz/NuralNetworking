import { Fragment } from "react";
import { Link } from "react-router-dom";
import Welcome from "../components/pre-authentication/Welcome";
//import classes from './WelcomePage.module.css'

const WelcomePage = function () {
	return (
		// <Fragment>
		// 	<h1>Welcome to social media app!</h1>
		// 	<h2>Create account here</h2>
		// 	<Link to="/auth?mode=signup">New account</Link>
		// 	<h2>Login here</h2>
		// 	<Link to="/auth?mode=login">Login</Link>
		// </Fragment>
		<Welcome />
	);
};

export default WelcomePage;
