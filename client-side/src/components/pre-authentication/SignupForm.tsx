import React from "react";
import classes from "./Forms.module.css";
import { Form } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import userType from "../../types/user";
import { authenticateUser } from "../../store/userSlice";
import LabledInput from "../UI/LabledInput";
import { loginSchema } from "./LoginForm";
import { PreAuthModalsNames } from "./Welcome";

type Props = {
	changeModal: (
		modalName: PreAuthModalsNames,
		sourceModalName?: PreAuthModalsNames
	) => void;
	originModalName?: PreAuthModalsNames;
};

export const signupSchema = loginSchema.extend({
	passwordConfirm: z
		.string()
		.min(1, { message: "Password confirmation is required." })
		.min(8, {
			message: "Password confirmation must contain least 8 characters.",
		})
		.max(40, {
			message: "Password confirmation can not exceed 40 characters.",
		}),
});

type FormFields = z.infer<typeof signupSchema>;

//form component for this app registration. inputs are email, password and password confirm. successful submit creates new user, authenticate him and change modal to VerifyEmailForm
const SignupForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(signupSchema),
	});

	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function

	//form's submit function, creates new user instance with provided data and authenticates user or display encountered errors
	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			//validate provided password equal passwordConfirm or throw an error
			if (!(data?.password === data?.passwordConfirm)) {
				throw new Error("Password confirmation does not match password.");
			}

			//send sign up request
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/signup",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			const resultData = await result?.json(); //request's results data response

			//evaluate request's response status
			if (!(resultData?.status === "success")) {
				throw new Error(resultData.message);
			}

			//store JWT token in local storage
			localStorage.setItem("token", resultData?.token);

			//user's data initialization for store's state
			const user: userType = {
				_id: resultData?.data?.user?._id,
				email: resultData?.data?.user?.email,
				friendsList: [],
				groupsList: [],
				pagesList: [],
				friendRequestsList: [],
			};

			//authenticate user with store's data ocject and change modal to SendVerificationForm
			dispatch(authenticateUser(user));
			props.changeModal("sendVerification", "signup");
		} catch (error) {
			//caught an error, display it's message to the user
			setError("root", {
				message: (error as Error)?.message || "Error signing up.",
			});
		}
	};

	return (
		<Form
			method="post"
			className={classes.form}
			onSubmit={handleSubmit(onSubmit)}
		>
			{errors?.root && (
				<span style={{ fontSize: "1rem", color: "red" }}>
					{errors?.root?.message}
				</span>
			)}
			<LabledInput
				{...register("email")}
				type="text"
				name="email"
				placeholder="Email address"
				error={errors?.email?.message}
			/>
			<LabledInput
				{...register("password")}
				type="password"
				name="password"
				placeholder="Password"
				error={errors?.password?.message}
			/>
			<LabledInput
				{...register("passwordConfirm")}
				type="password"
				name="passwordConfirm"
				placeholder="Confirm password"
				error={errors?.passwordConfirm?.message}
			/>
			<button
				disabled={isSubmitting}
				className={`${classes.submit} ${
					isSubmitting && classes["disabled-button"]
				}`}
				type="submit"
			>
				<h2 className={classes["submit__text"]}>Continue</h2>
			</button>
			<h6 className={classes.text}>
				Already have an account?{" "}
				<span
					className={classes["text-button"]}
					onClick={props.changeModal.bind(null, "login", "signup")}
				>
					Login
				</span>
			</h6>
		</Form>
	);
};

export default SignupForm;
