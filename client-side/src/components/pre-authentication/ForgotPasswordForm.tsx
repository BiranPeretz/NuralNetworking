import React from "react";
import classes from "./Forms.module.css";
import { Form } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const forgotPasswordSchema = loginSchema.pick({ email: true });

type FormFields = z.infer<typeof forgotPasswordSchema>;

//form component for users that forgot their password, available only for users with verified email. takes email as input. successful submit either sends appropriate email and change modal to PasswordResetForm(if email is varified) or change modal to SendVerificationForm (for unverified users)
const ForgotPasswordForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	//form's submit function, sends Email with password reset token or display encountered errors
	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			//send forgot password request
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/forgotPassword",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			const resultData = await result?.json(); //request's results data response
			//evaluate request's response status
			if (!(resultData?.status === "success")) {
				if (
					resultData?.error?.statusCode &&
					resultData?.error?.statusCode === 403
				) {
					//recieved forbidden error code which indicated unverified email in this case
					return props.changeModal("sendVerification", "forgotPassword"); //change modal to SendVerificationForm
				}
				throw new Error(resultData.message);
			}

			//verification email has been sent successfuly, change modal to PasswordResetForm
			props.changeModal("resetPassword", "forgotPassword");
		} catch (error) {
			//caught an error, display it's message to the user
			setError("root", {
				message: (error as Error)?.message || "Error sending reset email.",
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

export default ForgotPasswordForm;
