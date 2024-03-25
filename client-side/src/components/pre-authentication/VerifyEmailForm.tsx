import React from "react";
import classes from "./Forms.module.css";
import { Form } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LabledInput from "../UI/LabledInput";
import { resetPasswordSchema } from "./ResetPasswordForm";
import { PreAuthModalsNames } from "./Welcome";

type Props = {
	changeModal: (
		modalName: PreAuthModalsNames,
		sourceModalName?: PreAuthModalsNames
	) => void;
	originModalName?: PreAuthModalsNames;
};

const verifyEmailSchema = resetPasswordSchema.pick({ token: true });

type FormFields = z.infer<typeof verifyEmailSchema>;

const VerifyEmailForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(verifyEmailSchema),
	});

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/verifyEmail/${data?.token}`,
				{
					method: "PATCH",
				}
			);

			const resultData = await result?.json();

			if (!(resultData?.status === "success")) {
				throw new Error(resultData.message);
			}

			props.changeModal(
				props.originModalName === "signup" ? "createProfile" : "forgotPassword",
				"verifyEmail"
			);
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
				Varification token has been sent to your email, please attach it below.
			</h6>
			<LabledInput
				{...register("token")}
				type="text"
				name="token"
				placeholder="Token"
				error={errors?.token?.message}
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

export default VerifyEmailForm;
