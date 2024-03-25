import React, { useState, Fragment } from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../store/userSlice";
import { RootState } from "../../store/store";
import LabledInput from "../UI/LabledInput";
import getToken from "../../util/getToken";
import useLogout from "../../custom-hooks/useLogout";
import FileUpload from "../UI/FileUpload";
import createProfileFormClasses from "./CreateProfileForm.module.css";
import ImageUpload from "../../assets/icons/ImageUpload";
import ImageSuccess from "../../assets/icons/ImageSuccess";
import { PreAuthModalsNames } from "./Welcome";

type Props = {
	onCloseModal: () => void;
	originModalName?: PreAuthModalsNames;
};

const createProfileSchema = z.object({
	fullName: z
		.string()
		.min(1, { message: "Full name is required." })
		.max(40, { message: "Full name can not exceed 40 characters." })
		.regex(/^[A-Za-z ]+$/, {
			message:
				"Full name can only contain alphabetic characters divided by space.",
		}),
	about: z
		.string()
		.max(100, { message: "About description can not exceed 100 characters." })
		.optional(),
});

type FormFields = z.infer<typeof createProfileSchema>;

const CreateProfileForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(createProfileSchema),
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const logout = useLogout();
	const { email } = useSelector((state: RootState) => state.user);
	const token = getToken();
	const [displayFileUploader, setDisplayFileUploader] =
		useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>();

	const hideFileUploader = function () {
		setDisplayFileUploader(false);
	};

	const showFileUploader = function () {
		setDisplayFileUploader(true);
	};

	const notMeHandler = function (event: React.MouseEvent) {
		event.preventDefault();
		props.onCloseModal();
		logout();
	};

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			const formData = new FormData();

			formData.append("fullName", data?.fullName);
			if (data?.about) {
				formData.append("about", data?.about);
			}
			if (imageFile) {
				formData.append("image", imageFile);
			}

			const result = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/CreateProfile",
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			const resultData = await result?.json();

			if (!(resultData?.status === "success")) {
				throw new Error(resultData.message);
			}

			dispatch(createProfile(resultData.data.user));
			navigate("/feed");
		} catch (error) {
			setError("root", {
				message: (error as Error)?.message || "Error creating profile.",
			});
		}
	};

	return (
		<Fragment>
			<Form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
				{errors?.root && (
					<span style={{ fontSize: "1rem", color: "red" }}>
						{errors?.root?.message}
					</span>
				)}
				<LabledInput
					{...register("fullName")}
					type="text"
					name="fullName"
					placeholder="Enter your full name"
					error={errors?.fullName?.message}
				/>
				<LabledInput
					{...register("about")}
					type="text"
					name="about"
					placeholder="Tell us about yourself"
					error={errors?.about?.message}
				/>
				<div className={createProfileFormClasses["picture__container"]}>
					<h3 className={createProfileFormClasses["picture__text"]}>
						Add profile picture
					</h3>

					{imageFile ? (
						<ImageSuccess
							className={createProfileFormClasses.icon}
							onClick={showFileUploader}
						/>
					) : (
						<ImageUpload
							className={createProfileFormClasses.icon}
							onClick={showFileUploader}
						/>
					)}
				</div>
				<button
					disabled={isSubmitting}
					className={`${classes.submit} ${
						isSubmitting && classes["disabled-button"]
					}`}
					type="submit"
				>
					<h2 className={classes["submit__text"]}>Create profile</h2>
				</button>
				<h6 className={classes.text}>
					Creating profile for
					<strong
						style={{
							textDecoration: "underline",
							textUnderlineOffset: "2px",
							marginLeft: "0.25rem",
						}}
					>
						{email}
					</strong>
					<span
						className={classes["text-button"]}
						style={{ marginLeft: "0.375rem" }}
						onClick={notMeHandler}
					>
						Not me
					</span>
				</h6>
			</Form>
			<FileUpload
				setFile={setImageFile}
				displayFileUploader={displayFileUploader}
				onModalClose={hideFileUploader}
			/>
		</Fragment>
	);
};

export default CreateProfileForm;
