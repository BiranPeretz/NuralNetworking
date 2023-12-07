import React, { useRef } from "react";
import classes from "./Forms.module.css";
import { Form } from "react-router-dom";
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
const ForgotPasswordForm: React.FC<Props> = function (props) {
	const emailRef = useRef<HTMLInputElement>(null);

	const submitFormHandler = async function (event: React.FormEvent) {
		event.preventDefault();
		try {
			if (!emailRef.current!.value) {
				//TODO: handle/dispaly one of the inputs is missing to the user
				return;
			}

			const bodyObj = {
				email: emailRef.current!.value,
			};
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/forgotPassword",
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

			props.changeModal("resetPassword");
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
			<button type="submit">Submit!</button>
		</Form>
	);
};

export default ForgotPasswordForm;
