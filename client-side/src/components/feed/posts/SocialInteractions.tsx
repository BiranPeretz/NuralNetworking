import React, { useState, Fragment } from "react";
import classes from "./SocialInteractions.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { likeAndUnlike } from "../../../store/postsThunks";
import NewComment from "./NewComment";
import getToken from "../../../util/getToken";
import LikeIcon from "../../../assets/icons/Like";
import LikedIcon from "../../../assets/icons/Liked";
import CommentIcon from "../../../assets/icons/Comment";
import CommentingIcon from "../../../assets/icons/Commenting";
import commentType from "../../../types/comment";
import likeType from "../../../types/like";
import getTotalCommentsCount from "../../../util/getTotalCommentsCount";

type Props = {
	itemID: string;
	likeList: likeType[];
	commentList: commentType[]; //post's comments or child comments of a comment
	model: "posts" | "comments";
	containerClassname?: string; //top level div className attribute's value
	interactionClassname?: string; //actions (buttons) className attribute's value
	engagementsClassname?: string; //data counter (h4 tags) className attribute's value
};

//the interactions (like and comment) component for posts and comments. contain both data (text counters) and actions (like and comment buttons)
const SocialInteractions: React.FC<Props> = function ({
	itemID,
	likeList,
	commentList,
	model,
	containerClassname,
	interactionClassname,
	engagementsClassname,
}) {
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const token = getToken(); //JWT token
	const { _id: userID } = useSelector((state: RootState) => state.user);
	const [isLiked, setIsLiked] = useState<boolean>(
		likeList?.some((like) => like.user._id === userID) as boolean
	); //user's boolean like state of the item
	const [displayNewComment, setDisplayNewComment] = useState<boolean>(false);
	const actionType: "createComment" | "createCommentReply" =
		model === "posts" ? "createComment" : "createCommentReply"; //createComment for commenting posts, createCommentReply for commenting comments

	const likeButtonClickHandler = function (event: React.MouseEvent) {
		event.preventDefault();
		if (isLiked) {
			//unlike
			dispatch(likeAndUnlike(token!, itemID, "unlike", model));
			setIsLiked(false); //update user's like state
		} else {
			//like
			dispatch(likeAndUnlike(token!, itemID, "like", model));
			setIsLiked(true); //update user's like state
		}
	};

	const commentIconClickHandler = function () {
		setDisplayNewComment((prevState) => !prevState); //toggle hide/display state of the NewComment component
	};

	return (
		<Fragment>
			<div className={containerClassname || classes.container}>
				<button
					name="like"
					className={`${classes.interaction} ${interactionClassname}`}
					onClick={likeButtonClickHandler}
				>
					{isLiked ? <LikedIcon /> : <LikeIcon />}
					<h4 className={engagementsClassname || classes.engagements}>
						{likeList && likeList.length > 0
							? `${likeList.length}`
							: model === "posts"
							? "Like"
							: "0"}
					</h4>
				</button>
				<button
					name="comment"
					className={`${classes.interaction} ${interactionClassname}`}
					onClick={commentIconClickHandler}
				>
					{displayNewComment ? <CommentingIcon /> : <CommentIcon />}
					<h4 className={engagementsClassname || classes.engagements}>
						{commentList && commentList.length > 0
							? `${getTotalCommentsCount(commentList)}`
							: model === "posts"
							? "Comment"
							: "0"}
					</h4>
				</button>
			</div>
			{displayNewComment && (
				<NewComment
					parentID={itemID}
					actionType={actionType}
					setDisplayNewComment={setDisplayNewComment}
				/>
			)}
		</Fragment>
	);
};

export default SocialInteractions;
