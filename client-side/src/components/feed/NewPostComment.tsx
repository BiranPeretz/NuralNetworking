import React, { useRef } from "react";
import classes from "./NewPostComment.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { newPostComment } from "../../store/postsThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

type Props = {
	token: string;
	userID: string;
	parentID: string;
	actionType: "createComment" | "createCommentReply";
	setDisplayNewComment: (__: boolean) => void;
	userProfilePicture?: string;
	children?: React.ReactNode;
};

const NewPostComment: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>();
	const commentRef = useRef<HTMLInputElement>(null);

	const addNewCommentHandler = function () {
		if (!commentRef?.current?.value) {
			return;
		}
		dispatch(
			newPostComment(
				props.token,
				commentRef.current.value,
				props.parentID,
				props.actionType
			)
		);
		props.setDisplayNewComment(false);
	};
	return (
		<div className={classes.container}>
			<img
				className={classes["user-picture"]}
				src={
					props.userProfilePicture ||
					"https://randomuser.me/api/portraits/thumb/men/76.jpg"
				}
			/>
			<div className={classes["input__container"]}>
				<input placeholder="Write your comment..." ref={commentRef} />
				<AiOutlineSend
					className={classes.icon}
					onClick={addNewCommentHandler}
				/>
			</div>
		</div>
	);
};

export default NewPostComment;
