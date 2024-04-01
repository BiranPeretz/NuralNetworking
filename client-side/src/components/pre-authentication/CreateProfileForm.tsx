import React, { useState, Fragment } from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { createProfile } from "../../store/userSlice";
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

//zod schema for the form
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

//form component for this app's user profile creation. inputs are full name, self description (optional), and profile picture(optional). updates user's profile data and navigate user to feed on successful submit.
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
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const logout = useLogout(); //application's logout hook, execute logout functionality when called
	const { email } = useSelector((state: RootState) => state.user);
	const token = getToken(); //JWT token
	const [displayFileUploader, setDisplayFileUploader] =
		useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>();

	//hides the file upload modal
	const hideFileUploader = function () {
		setDisplayFileUploader(false);
	};

	//shows the file upload modal
	const showFileUploader = function () {
		setDisplayFileUploader(true);
	};

	//function for the "not me" button, log out the user and close the modal
	const notMeHandler = function (event: React.MouseEvent) {
		event.preventDefault();
		props.onCloseModal();
		logout();
	};

	//form's submit function, creates the profile with provided data and navigates user to feed or display encountered errors
	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			//initialize formData
			const formData = new FormData();
			formData.append("fullName", data?.fullName);
			if (data?.about) {
				formData.append("about", data?.about);
			}
			if (imageFile) {
				formData.append("image", imageFile);
			}

			//send profile creating request
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

			const resultData = await result?.json(); //request's results data response

			//evaluate request's response status
			if (!(resultData?.status === "success")) {
				throw new Error(resultData.message);
			}

			//update user's profile related data on store state
			dispatch(createProfile(resultData.data.user));

			navigate("/feed");
		} catch (error) {
			//caught an error, display it's message to the user
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
