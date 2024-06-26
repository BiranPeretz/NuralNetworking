import React, { Fragment, useState } from "react";
import classes from "./NewPostForm.module.css";
import getToken from "../../../util/getToken";
import PostHeader from "./PostHeader";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { createPost } from "../../../store/postsThunks";
import { AppDispatch } from "../../../store/store";
import type { postRequired } from "../../../types/post";
import type socialItemType from "../../../types/socialItem";
import FileUpload from "../../UI/FileUpload";
import SocialItemSelect from "../../UI/SocialItemSelect";
import EmojiPicker from "../../UI/EmojiPicker";
import ImageUpload from "../../../assets/icons/ImageUpload";
import ImageSuccess from "../../../assets/icons/ImageSuccess";

type Props = {
	creatorType: "User" | "Group" | "Page";
	creator: socialItemType; //always the requesting user
	closeModal: () => void;
	hostsArray?: socialItemType[];
	children?: React.ReactNode;
};

//zod schema for the form
const newPostSchema = z.object({
	content: z
		.string()
		.min(1, { message: "Post content required." })
		.max(400, { message: "Post content cannot exceed 400 characters." }),
});

type FormFields = z.infer<typeof newPostSchema>;

//the form for creating posts, takes text content and optional image
const NewPostForm: React.FC<Props> = function (props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
		watch,
		setValue,
	} = useForm<FormFields>({
		resolver: zodResolver(newPostSchema),
	});

	const token = getToken(); //JWT token
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const [displayEmojiPicker, setDisplayEmojiPicker] = useState<boolean>(false); //emoji picker modal display state
	const [displayFileUploader, setDisplayFileUploader] =
		useState<boolean>(false); //file upload modal display state
	const [imageFile, setImageFile] = useState<any>(); //uploaded image file
	const [selectedOption, setSelectedOption] = useState<any>(undefined);
	const hostID: socialItemType | undefined = props.hostsArray?.find(
		(item) => item?._id === selectedOption?.value
	); //the host item, either group or page

	const hideFileUploader = function () {
		setDisplayFileUploader(false);
	};

	const showFileUploader = function () {
		setDisplayFileUploader(true);
	};

	const onSubmit: SubmitHandler<FormFields> = async function (data) {
		try {
			//required data to create an post
			const post: postRequired = {
				content: { text: data?.content },
				creatorType: hostID ? props.creatorType : "User",
				creatorID: hostID?._id || props.creator._id,
				author: hostID ? props.creator._id : undefined,
				image: imageFile || undefined,
			};

			await dispatch(createPost(token!, post));

			setDisplayEmojiPicker(false);
			props.closeModal();
		} catch (error) {
			//caught an error, display it's message to the user
			setError("root", {
				message: (error as Error)?.message || "Error creating the post.",
			});
		}
	};

	//insert emojies to the end of the text
	const addEmojiHandler = function (emoji: any) {
		setValue("content", watch("content") + emoji?.native || "");
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
				<div className={classes["top-container"]}>
					<PostHeader
						creator={hostID || props.creator}
						author={hostID ? props.creator : undefined}
					/>{" "}
					{props.creatorType !== "User" && (
						<SocialItemSelect
							selectedOption={selectedOption}
							setSelectedOption={setSelectedOption}
							socialItemsArray={props.hostsArray || []}
							placeholder={`Select ${props.creatorType.toLowerCase()}`}
						/>
					)}
				</div>
				{errors?.content && (
					<span
						style={{
							fontSize: "1.125rem",
							color: "red",
							marginRight: "auto",
							marginBottom: "0.5rem",
						}}
					>
						{errors?.content?.message}
					</span>
				)}
				<textarea
					{...register("content")}
					name="content"
					className={`${classes["post__content"]} ${
						errors?.content && classes["content__error"]
					}`}
					placeholder="Share your thoughts..."
				/>
				<div className={classes["post__add-ons"]}>
					<h3 className={classes["add-ons__text"]}>More for your post</h3>

					<div className={classes["add-ons__icons"]}>
						{imageFile ? (
							<ImageSuccess
								className={classes.icon}
								onClick={showFileUploader}
							/>
						) : (
							<ImageUpload
								className={classes.icon}
								onClick={showFileUploader}
							/>
						)}
						<EmojiPicker
							displayEmojiPicker={displayEmojiPicker}
							setDisplayEmojiPicker={setDisplayEmojiPicker}
							addEmojiHandler={addEmojiHandler}
						/>
					</div>
				</div>
				<button
					disabled={isSubmitting}
					className={`${classes.submit} ${
						isSubmitting && classes["disabled-button"]
					}`}
					type="submit"
				>
					<h2 className={classes["submit__text"]}>Post</h2>
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

export default NewPostForm;
