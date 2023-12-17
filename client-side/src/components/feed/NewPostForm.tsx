import React, { Fragment, useState, useRef } from "react";
import classes from "./NewPostForm.module.css";
import { BsEmojiSmile } from "react-icons/bs";
import { FaRegWindowClose } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { IoMdCheckmark } from "react-icons/io";
import PostHeader from "./PostHeader";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/postsThunks";
import { AppDispatch } from "../../store/store";
import type { postRequired } from "../../types/post";
import type socialItemType from "../../types/socialItem";
import OptionsModal from "../UI/OptionsModal";
import Select from "react-select";
import FileUpload from "../UI/FileUpload";
import ReactDOM from "react-dom";
import Modal from "../UI/Modal";

type Props = {
	creatorType: "User" | "Group" | "Page";
	creatorID: socialItemType; //always the requesting user
	closeModal: () => void;
	hostsArray?: socialItemType[];
	children?: React.ReactNode;
};

const SelectListItem: React.FC<{
	data: { value: string; label: string; profilePicture: string | undefined };
	innerProps: any;
}> = function ({ data, innerProps }) {
	return (
		<div
			className={classes["item-select__container"]}
			key={data.value}
			{...innerProps}
		>
			<img
				className={classes["item-select__img"]}
				src={
					data.profilePicture ||
					"https://randomuser.me/api/portraits/thumb/men/76.jpg"
				}
			/>
			<span className={classes["item-select__span"]}>{data.label}</span>
		</div>
	);
};

const NewPostForm: React.FC<Props> = function (props) {
	const token = localStorage.getItem("token");
	const dispatch = useDispatch<AppDispatch>();
	const [emojiCoords, setEmojiCoords] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const [displayEmoPicker, setDisplayEmoPicker] = useState<boolean>(false);
	const [displayFileUploader, setDisplayFileUploader] =
		useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>();
	const [selectedOption, setSelectedOption] = useState<any>(undefined);
	const contentRef = useRef<HTMLTextAreaElement>(null);

	const options = props.hostsArray?.map((item) => {
		return {
			value: item._id,
			label: item.name,
			profilePicture:
				item?.profilePicture ||
				"https://randomuser.me/api/portraits/thumb/men/76.jpg",
		};
	});

	const hostID: socialItemType | undefined = props.hostsArray?.find(
		(item) => item?._id === selectedOption?.value
	);

	const hideEmojiPicker = function () {
		setDisplayEmoPicker(false);
	};

	const showEmojiPicker = function (event: React.MouseEvent<SVGSVGElement>) {
		const rect = (event.target as SVGSVGElement).getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		setEmojiCoords({ x: centerX, y: centerY });
		setDisplayEmoPicker(true);
	};

	const hideFileUploader = function () {
		setDisplayFileUploader(false);
	};

	const showFileUploader = function () {
		setDisplayFileUploader(true);
	};

	const onSubmitHandler = function (event: React.FormEvent) {
		event.preventDefault();

		if (!contentRef?.current?.value?.trim()) {
			return;
		}

		const post: postRequired = {
			content: { text: contentRef!.current!.value },
			creatorType: hostID ? props.creatorType : "User",
			creatorID: hostID?._id || props.creatorID._id,
			author: hostID ? props.creatorID._id : undefined,
			image: imageFile || undefined,
		};

		dispatch(createPost(token!, post));
		hideEmojiPicker();
		props.closeModal();
	};

	const addEmojiHandler = function (emoji: any) {
		if (contentRef?.current) {
			contentRef.current.value += emoji?.native || "";
		}
	};

	return (
		<Fragment>
			<form className={classes.form} onSubmit={onSubmitHandler}>
				<div className={classes["top-container"]}>
					<PostHeader
						creatorID={hostID || props.creatorID}
						author={hostID ? props.creatorID : undefined}
					/>

					{props.creatorType !== "User" && (
						<Select
							defaultValue={selectedOption}
							onChange={setSelectedOption}
							options={options}
							components={{
								Option: SelectListItem,
							}}
							placeholder={`Select ${props.creatorType.toLowerCase()}`}
							className={classes.select}
						/>
					)}
				</div>
				<textarea
					name="content"
					className={classes["post__content"]}
					placeholder="Share your thoughts..."
					ref={contentRef}
				/>
				<div className={classes["post__add-ons"]}>
					<h3>More for your post</h3>

					<div className={classes["add-ons__icons"]}>
						{imageFile ? (
							<IoMdCheckmark
								className={classes.icon}
								size="28px"
								color="#00ff37"
								onClick={showFileUploader}
							/>
						) : (
							<AiOutlinePicture
								className={classes.icon}
								size="30px"
								onClick={showFileUploader}
							/>
						)}

						{displayEmoPicker ? (
							<FaRegWindowClose
								className={classes.icon}
								size="30px"
								color="red"
								onClick={hideEmojiPicker}
							/>
						) : (
							<BsEmojiSmile
								className={classes.icon}
								size="30px"
								onClick={showEmojiPicker}
							/>
						)}
					</div>
				</div>
				<button className={classes.submit} type="submit">
					<h2>post</h2>
				</button>
				<div></div>
			</form>
			{displayEmoPicker && (
				<OptionsModal
					positionCoords={emojiCoords}
					onClose={hideEmojiPicker}
					onEmojiSelect={addEmojiHandler}
				/>
			)}
			{displayFileUploader &&
				ReactDOM.createPortal(
					<Modal
						title="Upload your image"
						onClose={hideFileUploader}
						className={classes["file-uploader__modal"]}
						backdropClassName={classes["file-uploader__backdrop"]}
					>
						<FileUpload setFile={setImageFile} />
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default NewPostForm;
