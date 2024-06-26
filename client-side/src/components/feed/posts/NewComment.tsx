import React, { useRef } from "react";
import classes from "./NewComment.module.css";
import { createComment } from "../../../store/postsThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import ProfilePicture from "../../UI/ProfilePicture";
import getToken from "../../../util/getToken";
import Send from "../../../assets/icons/Send";

type Props = {
	parentID: string;
	actionType: "createComment" | "createCommentReply";
	setDisplayNewComment: (__: boolean) => void;
};

//the component that the user is using while writing new comment, contain the commenting user's profile picture, text-box and send button
const NewComment: React.FC<Props> = function (props) {
	const token = getToken(); //JWT token
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const commentRef = useRef<HTMLInputElement>(null);

	const addNewCommentHandler = function () {
		if (!commentRef?.current?.value) {
			return;
		}
		dispatch(
			createComment(
				token!,
				commentRef.current.value,
				props.parentID,
				props.actionType
			)
		);
		props.setDisplayNewComment(false);
	};
	return (
		<div className={classes.container}>
			<ProfilePicture className={classes["user-picture"]} />
			<div className={classes["input__container"]}>
				<input placeholder="Bits go here..." ref={commentRef} />
				<Send className={classes.icon} onClick={addNewCommentHandler} />
			</div>
		</div>
	);
};

export default NewComment;
