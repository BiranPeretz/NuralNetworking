import React, { Fragment, useState } from "react";
import classes from "./NewSocialInstanceForm.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { groupRequired } from "../../types/group";
import { pageRequired } from "../../types/page";
import { createGroup, createPage } from "../../store/userThunks";
import getToken from "../../util/getToken";
import LabledInput from "../UI/LabledInput";
import FileUpload from "../UI/FileUpload";
import ImageUpload from "../../assets/icons/ImageUpload";
import ImageSuccess from "../../assets/icons/ImageSuccess";

type Props = {
	instanceType: "group" | "page";
	closeModal: () => void;
};
//zod schema for the form
const newInstanceSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name is required." })
		.max(40, { message: "Name can not exceed 40 characters." }),
	description: z
		.string()
		.min(1, { message: "Description is required." })
		.max(200, { message: "Description can not exceed 200 characters." }),
});

type FormFields = z.infer<typeof newInstanceSchema>;

//create group/page form
const NewSocialInstanceForm: React.FC<Props> = function ({
	instanceType,
	closeModal,
}) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		resolver: zodResolver(newInstanceSchema),
	});
	const token = getToken(); //JWT token
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const [displayFileUploader, setDisplayFileUploader] =
		useState<boolean>(false); //control file uploading modal
	const [imageFile, setImageFile] = useState<any>(); //the image uploaded to the form

	const hideFileUploader = function () {
		setDisplayFileUploader(false);
	};

	const showFileUploader = function () {
		setDisplayFileUploader(true);
	};

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			//instance to create
			const instanceItem: groupRequired | pageRequired = {
				name: data?.name,
				description: data?.description,
				profilePicture: imageFile || undefined,
			};

			if (instanceType === "group") {
				await dispatch(createGroup(token!, instanceItem as groupRequired));
			} else {
				await dispatch(createPage(token!, instanceItem as pageRequired));
			}

			closeModal();
		} catch (error) {
			//caught an error, display it's message to the user
			setError("root", {
				message: (error as Error)?.message || "Error creating profile.",
			});
		}
	};

	return (
		<Fragment>
			<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
				{errors?.root && (
					<span
						style={{ fontSize: "1rem", color: "red", marginBottom: "2rem" }}
					>
						{errors?.root?.message}
					</span>
				)}
				<div className={classes["picture__container"]}>
					<h3 className={classes["picture__text"]}>
						Add group profile picture
					</h3>

					{imageFile ? (
						<ImageSuccess className={classes.icon} onClick={showFileUploader} />
					) : (
						<ImageUpload className={classes.icon} onClick={showFileUploader} />
					)}
				</div>
				<LabledInput
					{...register("name")}
					type="text"
					name={"name"}
					placeholder={`Enter ${instanceType} name...`}
					error={errors?.name?.message}
				/>
				{errors?.description && (
					<span style={{ fontSize: "1rem", color: "red", marginRight: "auto" }}>
						{errors?.description?.message}
					</span>
				)}
				<textarea
					{...register("description")}
					name="description"
					className={`${classes["instance__content"]} ${
						errors?.description && classes["content__error"]
					}`}
					placeholder={`Enter ${instanceType} description...`}
				/>
				<button
					disabled={isSubmitting}
					className={`${classes.submit} ${
						isSubmitting && classes["disabled-button"]
					}`}
					type="submit"
				>
					<h2
						className={classes["submit__text"]}
					>{`Create ${instanceType}`}</h2>
				</button>
			</form>
			<FileUpload
				setFile={setImageFile}
				displayFileUploader={displayFileUploader}
				onModalClose={hideFileUploader}
			/>
		</Fragment>
	);
};

export default NewSocialInstanceForm;
