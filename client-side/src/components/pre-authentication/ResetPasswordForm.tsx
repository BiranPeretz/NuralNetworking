import React from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import userType from "../../types/user";
import { authenticateUser } from "../../store/userSlice";
import LabledInput from "../UI/LabledInput";
import { signupSchema } from "./SignupForm";
import { PreAuthModalsNames } from "./Welcome";

type Props = {
	changeModal: (
		modalName: PreAuthModalsNames,
		sourceModalName?: PreAuthModalsNames
	) => void;
	originModalName?: PreAuthModalsNames;
};

export const resetPasswordSchema = signupSchema.omit({ email: true }).merge(
	z.object({
		token: z
			.string()
			.min(1, { message: "Reset token is required." })
			.length(64, { message: "Token must be exactly 64 characters long." }),
	})
);

type FormFields = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			if (!(data?.password === data?.passwordConfirm)) {
				throw new Error("Password confirmation does not match password.");
			}

			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/resetPassword/${data?.token}`,
				{
					method: "PATCH",
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
				props.changeModal("createProfile", "resetPassword");
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
				message: (error as Error)?.message || "Error resetting password.",
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
			<h6
				className={classes.text}
				style={{
					fontSize: "1rem",
					lineHeight: "1.25rem",
					fontWeight: "600",
					color: "black",
				}}
			>
				Password reset token has been sent to your email, please attach it
				below.
			</h6>
			<LabledInput
				{...register("token")}
				type="text"
				name="token"
				placeholder="Token"
				error={errors?.token?.message}
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
		</Form>
	);
};

export default ResetPasswordForm;
