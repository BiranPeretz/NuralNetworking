import React from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import userType from "../../types/user";
import { authenticateUser } from "../../store/userSlice";
import LabledInput from "../UI/LabledInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { PreAuthModalsNames } from "./Welcome";

type Props = {
	changeModal: (
		modalName: PreAuthModalsNames,
		sourceModalName?: PreAuthModalsNames
	) => void;
	originModalName?: PreAuthModalsNames;
};

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required." })
		.email({ message: "Invalid email format." }),
	password: z
		.string()
		.min(1, { message: "Password is required." })
		.min(8, { message: "Password must contain least 8 characters." })
		.max(40, { message: "Password can not exceed 40 characters." }),
});

type FormFields = z.infer<typeof loginSchema>;

const LoginForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(loginSchema),
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			const resultData = await result?.json();
			if (!(resultData?.status === "success")) {
				throw new Error(resultData.message);
			}

			//store JWT token in local storage
			localStorage.setItem("token", resultData?.token);

			const user: userType = {
				_id: resultData?.data?.user?._id,
				email: resultData?.data?.user?.email,
				friendsList: [],
				groupsList: [],
				pagesList: [],
				friendRequestsList: [],
			};

			if (!resultData?.data?.user?.fullName) {
				dispatch(authenticateUser(user));
				props.changeModal("createProfile", "login");
				return;
			}

			user.fullName = resultData?.data?.user?.fullName;
			user.profilePicture = resultData?.data?.user?.profilePicture;
			user.about = resultData?.data?.user?.about;
			user.verifiedEmail = resultData?.data?.user?.verifiedEmail;

			dispatch(authenticateUser(user));
			navigate("/feed");
		} catch (error) {
			setError("root", {
				message: (error as Error)?.message || "Error logging in.",
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
			<span
				className={classes["text-button"]}
				style={{ marginLeft: "auto" }}
				onClick={props.changeModal.bind(null, "forgotPassword", "login")}
			>
				Forgot password
			</span>
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
				Don't have an account?
				<span
					style={{ marginLeft: "0.375rem" }}
					className={classes["text-button"]}
					onClick={props.changeModal.bind(null, "signup", "login")}
				>
					Sign up
				</span>
			</h6>
		</Form>
	);
};

export default LoginForm;
