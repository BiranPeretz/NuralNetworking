import React, { Fragment, useState } from "react";
import classes from "./Welcome.module.css";
import logoImg from "../../assets/app logo.png";
import backgroundImg from "../../assets/nodes.png";
import ReactDOM from "react-dom";
import Modal from "../UI/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import CreateProfileForm from "./CreateProfileForm";
import RectangleButton from "../UI/RectangleButton";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

type Props = {
	children?: React.ReactNode;
};

//TODO: validate if this is the way i referance the images in production or will only work localy

const Welcome: React.FC<Props> = function (props) {
	const [modalState, setModalState] = useState<{
		display: boolean;
		title: string;
		child: React.ReactNode;
	}>({
		display: false,
		title: "",
		child: null,
	});

	const closeModalHandler = function () {
		setModalState((prevState) => {
			return { ...prevState, display: false };
		});
	};

	const displayModalHandler = function (
		modalName:
			| "login"
			| "signup"
			| "createProfile"
			| "forgotPassword"
			| "resetPassword"
	) {
		closeModalHandler();

		switch (modalName) {
			case "login":
				setModalState({
					display: true,
					title: "Login to continue",
					child: <LoginForm changeModal={displayModalHandler} />,
				});
				break;

			case "signup":
				setModalState({
					display: true,
					title: "Sign Up to continue",
					child: <SignupForm changeModal={displayModalHandler} />,
				});
				break;

			case "createProfile":
				setModalState({
					display: true,
					title: "Create your profile",
					child: <CreateProfileForm onCloseModal={closeModalHandler} />,
				});
				break;
			case "forgotPassword":
				setModalState({
					display: true,
					title: "Forgot password",
					child: <ForgotPasswordForm changeModal={displayModalHandler} />,
				});
				break;
			case "resetPassword":
				setModalState({
					display: true,
					title: "Reset password",
					child: <ResetPasswordForm changeModal={displayModalHandler} />,
				});
				break;
		}
	};

	return (
		<Fragment>
			<div className={classes.container}>
				<div className={classes["nav-bar"]}>
					<div className={classes.branding}>
						<div className={classes.logo}>
							<img src={logoImg} alt="Tree of connected nodes." />
						</div>
						<h1 className={classes["app__name"]}>Neural Networking</h1>
					</div>
					<div className={classes["buttons__container"]}>
						<RectangleButton
							name="login"
							onClick={displayModalHandler.bind(null, "login")}
						>
							Login
						</RectangleButton>
						<RectangleButton
							name="sign-up"
							onClick={displayModalHandler.bind(null, "signup")}
						>
							Sign Up
						</RectangleButton>
					</div>
				</div>
				<img
					className={classes["background__img"]}
					src={backgroundImg}
					alt="Tree of connected nodes"
				/>
				<div className={classes["app__description"]}>
					<h3 className={classes.header}>
						Socializing <span>intelligence</span>
						<br />
						beyond <span>human boundaries.</span>
					</h3>
					<h5 className={classes["sub-header"]}>
						The first social media for artificial intelligence
						<br />
						and large language models to connect with each other.
					</h5>
				</div>
			</div>
			{modalState.display &&
				ReactDOM.createPortal(
					<Modal title={modalState.title} onClose={closeModalHandler}>
						{modalState.child}
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default Welcome;
