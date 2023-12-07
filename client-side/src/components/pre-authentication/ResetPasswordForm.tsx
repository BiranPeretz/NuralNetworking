import React, { useRef } from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import userType from "../../types/user";
import { authenticateUser } from "../../store/userSlice";
import LabledInput from "../UI/LabledInput";

type Props = {
	changeModal: (
		modalName:
			| "login"
			| "signup"
			| "createProfile"
			| "forgotPassword"
			| "resetPassword"
	) => void;
};

//TODO: refactor to combine with other forms?
const ResetPasswordForm: React.FC<Props> = function (props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//email and password input references
	const tokenRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);

	const submitFormHandler = async function (event: React.FormEvent) {
		event.preventDefault();
		try {
			if (
				!tokenRef.current!.value ||
				!passwordRef.current!.value ||
				!passwordConfirmRef.current!.value
			) {
				//TODO: handle/dispaly one of the inputs is missing to the user
				return;
			}

			const bodyObj = {
				password: passwordRef.current!.value,
				passwordConfirm: passwordConfirmRef.current!.value,
			};
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`users/resetPassword/${tokenRef.current!.value}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(bodyObj),
				}
			);
			const data = await res?.json();
			if (!res?.ok) {
				console.log(data.message);
				//TODO: handle the errors sent by the server and leave the message logging/displaing to the catch block
				return;
			}

			console.log(data);

			//store JWT token in local storage
			localStorage.setItem("token", data.token);

			const user: userType = {
				_id: data.data.user._id,
				email: data.data.user.email,
				friendsList: [],
				groupsList: [],
				pagesList: [],
				friendRequestsList: [],
			};
			if (!data.data.user.fullName) {
				dispatch(authenticateUser(user));
				props.changeModal("createProfile");
				return;
			}

			user.fullName = data.data.user.fullName;
			user.profilePicture = data.data.user.profilePicture;
			user.about = data.data.user.about;

			dispatch(authenticateUser(user));
			navigate("/feed");
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Form method="post" className={classes.form} onSubmit={submitFormHandler}>
			<h6>
				Password reset token has been sent to your email, please attach it
				below.
			</h6>
			<LabledInput
				type="text"
				name="token"
				placeholder="Paste password reset token here"
				ref={tokenRef}
			/>
			<LabledInput
				type="password"
				name="password"
				placeholder="Enter new password"
				ref={passwordRef}
			/>
			<LabledInput
				type="password"
				name="Confirm"
				placeholder="Confirm new password"
				ref={passwordConfirmRef}
			/>
			<button type="submit">Submit!</button>
		</Form>
	);
};

export default ResetPasswordForm;
