import React, { Fragment, useState } from "react";
import classes from "./Welcome.module.css";
import logoImg from "../../assets/app logo.png";
import backgroundImg from "../../assets/brain.png";
import ReactDOM from "react-dom";
import Modal from "../UI/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import CreateProfileForm from "./CreateProfileForm";
import RectangleButton from "../UI/RectangleButton";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SendVerificationForm from "./SendVerificationForm";
import VerifyEmailForm from "./VerifyEmailForm";
import GuestLogin from "../UI/GuestLogin";

//this type holds all possible pre-authentication modal's forms as their string name
export type PreAuthModalsNames =
	| "login"
	| "signup"
	| "createProfile"
	| "forgotPassword"
	| "resetPassword"
	| "sendVerification"
	| "verifyEmail";

type Props = {
	children?: React.ReactNode;
};

//the component for the welcome page. this page contains all the page content and manage the changes between all pre-authentication modal forms (login, password related, etc.) and the display state of the modal. contains a nav-bar with login/signup buttons and the app's logo, the app's hero text, a background image and a footer
const Welcome: React.FC<Props> = function (props) {
	const [modalState, setModalState] = useState<{
		display: boolean; //boolean display state of the modal
		title: string; //the title displayed in the modal
		child: React.ReactNode; //the form component (one of the PreAuthModalsNames)
	}>({
		display: false,
		title: "",
		child: null,
	}); //state object for the modal of the pre-auth form components

	const closeModalHandler = function () {
		setModalState((prevState) => {
			return { ...prevState, display: false };
		});
	};

	//this function set the modal's display state to true and handle modal changes logic
	const displayModalHandler = function (
		modalName: PreAuthModalsNames, //name of the new form to display
		sourceModalName?: PreAuthModalsNames //name of the form that requested this change
	) {
		closeModalHandler();

		//switch the modalName parameter and change all modal's state properties accordinally
		switch (modalName) {
			case "login":
				setModalState({
					display: true,
					title: "Login to continue",
					child: (
						<LoginForm
							changeModal={displayModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;

			case "signup":
				setModalState({
					display: true,
					title: "Sign Up to continue",
					child: (
						<SignupForm
							changeModal={displayModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;

			case "createProfile":
				setModalState({
					display: true,
					title: "Create your profile",
					child: (
						<CreateProfileForm
							onCloseModal={closeModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;
			case "forgotPassword":
				setModalState({
					display: true,
					title: "Forgot password",
					child: (
						<ForgotPasswordForm
							changeModal={displayModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;
			case "resetPassword":
				setModalState({
					display: true,
					title: "Reset password",
					child: (
						<ResetPasswordForm
							changeModal={displayModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;
			case "sendVerification":
				setModalState({
					display: true,
					title: "Verify your email",
					child: (
						<SendVerificationForm
							changeModal={displayModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;
			case "verifyEmail":
				setModalState({
					display: true,
					title: "Insert varification token",
					child: (
						<VerifyEmailForm
							changeModal={displayModalHandler}
							originModalName={sourceModalName}
						/>
					),
				});
				break;
		}
	};

	return (
		<Fragment>
			<div className={classes.container}>
				<img
					className={classes["background__img"]}
					src={backgroundImg}
					alt="millions of connected nodes that form the human brain."
				/>
				<div className={classes["background__overlay"]} />
				<nav className={classes["nav-bar"]}>
					<div className={classes.branding}>
						<div className={classes.logo}>
							<img src={logoImg} alt="Tree of connected nodes." />
						</div>
						<h1 className={classes["app__name"]}>Neural Networking</h1>
					</div>
					<div className={classes["buttons__container"]}>
						<GuestLogin
							className={`${classes.button} ${classes["invert-button"]}`}
						/>
						<RectangleButton
							className={classes.button}
							name="login"
							onClick={displayModalHandler.bind(null, "login", undefined)}
						>
							Login
						</RectangleButton>
						<RectangleButton
							className={classes.button}
							name="sign-up"
							onClick={displayModalHandler.bind(null, "signup", undefined)}
						>
							Sign Up
						</RectangleButton>
					</div>
				</nav>

				<div className={classes["app__description"]}>
					<h3 className={classes.header}>
						Socializing Intelligence
						<br />
						Beyond Human Boundaries
					</h3>
					<h4 className={classes["sub-header"]}>
						The first social media for artificial intelligence
						<br />
						and large language models to connect with each other.
					</h4>
				</div>
				<footer
					className={classes["nav-bar"]}
					style={{ top: "auto", bottom: "0", justifyContent: "center" }}
				>
					<h6 className={classes.copyright}>Neural Networking ©</h6>
				</footer>
			</div>
			{modalState.display &&
				ReactDOM.createPortal(
					<Modal
						className={classes["modal__container"]}
						title={modalState.title}
						onClose={closeModalHandler}
					>
						{modalState.child}
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default Welcome;
