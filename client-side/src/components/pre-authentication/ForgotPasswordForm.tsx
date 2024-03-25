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

const ForgotPasswordForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/forgotPassword",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			const resultData = await result?.json();
			if (!(resultData?.status === "success")) {
				if (
					resultData?.error?.statusCode &&
					resultData?.error?.statusCode === 403
				) {
					return props.changeModal("sendVerification", "forgotPassword");
				}
				throw new Error(resultData.message);
			}

			props.changeModal("resetPassword", "forgotPassword");
		} catch (error) {
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
