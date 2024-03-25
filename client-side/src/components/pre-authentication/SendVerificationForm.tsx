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

const sendVerificationSchema = loginSchema.pick({ email: true });

type FormFields = z.infer<typeof sendVerificationSchema>;

const SendVerificationForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(sendVerificationSchema),
	});

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/sendVerificationEmail",
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

			props.changeModal("verifyEmail", props.originModalName);
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
			<h6
				className={classes.text}
				style={{
					fontSize: "1rem",
					lineHeight: "1.25rem",
					fontWeight: "600",
					color: "black",
				}}
			>
				Verifing your email is optional for password reset.
			</h6>
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
				style={{ margin: "1rem 0" }}
				type="submit"
			>
				<h2 className={classes["submit__text"]}>Continue</h2>
			</button>
			<button
				disabled={isSubmitting}
				className={`${classes.submit} ${
					isSubmitting && classes["disabled-button"]
				}`}
				style={{ margin: "1rem 0 0 0" }}
				onClick={props.changeModal.bind(
					null,
					props.originModalName === "signup"
						? "createProfile"
						: "forgotPassword",
					"sendVerification"
				)}
			>
				<h2 className={classes["submit__text"]}>
					{props.originModalName === "signup" ? "Skip" : "Back"}
				</h2>
			</button>
		</Form>
	);
};

export default SendVerificationForm;
