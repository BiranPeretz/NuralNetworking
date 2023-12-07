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
const SignupForm: React.FC<Props> = function (props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//email and password input references
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);

	const submitFormHandler = async function (event: React.FormEvent) {
		event.preventDefault();
		try {
			if (
				!emailRef.current!.value ||
				!passwordRef.current!.value ||
				!passwordConfirmRef.current!.value
			) {
				//TODO: handle/dispaly one of the inputs is missing to the user
				return;
			}

			const bodyObj = {
				email: emailRef.current!.value,
				password: passwordRef.current!.value,
				passwordConfirm: passwordConfirmRef.current!.value,
			};
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/signup",
				{
					method: "POST",
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
				friendsList: data.data.user.friendsList,
				groupsList: data.data.user.groupsList,
				pagesList: data.data.user.pagesList,
				friendRequestsList: [],
			};

			dispatch(authenticateUser(user));
			props.changeModal("createProfile");
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Form method="post" className={classes.form} onSubmit={submitFormHandler}>
			<LabledInput
				type="text"
				name="email"
				placeholder="Enter email"
				ref={emailRef}
			/>
			<LabledInput
				type="password"
				name="password"
				placeholder="Enter password"
				ref={passwordRef}
			/>
			<LabledInput
				type="password"
				name="Confirm"
				placeholder="Confirm password"
				ref={passwordConfirmRef}
			/>
			<button type="submit">Submit!</button>
			<h6>
				Already have an account?{" "}
				<span onClick={props.changeModal.bind(null, "login")}>Login</span>
			</h6>
		</Form>
	);
};

export default SignupForm;
