import React, { useState, Fragment } from "react";
import classes from "./PostCommentItem.module.css";
import commentType from "../../types/comment";
import { formatDistanceToNow } from "date-fns";
import Card from "../UI/Card";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaCommentAlt, FaRegCommentAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { likeAndUnlike } from "../../store/postsThunks";
import NewPostComment from "./NewPostComment";
import getToken from "../../util/getToken";

const getIsLiked = function (userID: string, comment: commentType): boolean {
	return comment?.likeList?.some((item) => item.user._id === userID) as boolean;
};

type Props = {
	comment: commentType;
	className?: string;
	children?: React.ReactNode;
};

//TODO: add likes and replies amount to icons
const PostCommentItem: React.FC<Props> = function (props) {
	const {
		_id: commentID,
		postID: commentPostID,
		userID: commentUserID,
		timestamp,
		content,
		childCommentIDs,
	} = props.comment;
	const [isLiked, setIsLiked] = useState<boolean>(
		getIsLiked(commentUserID._id!, props.comment)
	);
	const [displayNewReply, setDisplayNewReply] = useState<boolean>(false);
	const { _id: userID } = useSelector((state: RootState) => state.user);
	const token = getToken();
	const dispatch = useDispatch<AppDispatch>();

	const likeButtonClickHandler = function (event: React.MouseEvent) {
		event.preventDefault();
		if (isLiked) {
			//unlike
			dispatch(likeAndUnlike(token!, commentID, "unlike", "comments"));
			setIsLiked(false);
		} else {
			//like
			dispatch(likeAndUnlike(token!, commentID, "like", "comments"));
			setIsLiked(true);
		}
	};

	const commentButtonClickHandler = function () {
		setDisplayNewReply((prevState) => !prevState);
	};

	return (
		<div
			className={
				props.className
					? `${classes["comment-wrapper"]} ${props.className}`
					: classes["comment-wrapper"]
			}
		>
			<li className={classes["comment-container"]}>
				<img
					className={classes["user-picture"]}
					src={
						commentUserID?.profilePicture ||
						"https://randomuser.me/api/portraits/thumb/men/76.jpg"
					}
				/>
				<Card className={classes["content-container"]}>
					<div className={classes["comment__header"]}>
						<span className={classes["user-name"]}>{commentUserID.name}</span>
						<span className={classes.timestamp}>{`${formatDistanceToNow(
							new Date(timestamp)
						)} ago`}</span>
					</div>
					<p className={classes.content}>{content}</p>
				</Card>
				<div className={classes.engagements}>
					<div
						className={classes["icon__container"]}
						onClick={likeButtonClickHandler}
					>
						{isLiked ? (
							<BiSolidLike className={classes.icon} />
						) : (
							<BiLike className={classes.icon} />
						)}
					</div>
					<div
						className={classes["icon__container"]}
						onClick={commentButtonClickHandler}
					>
						{displayNewReply ? (
							<FaCommentAlt className={classes.icon} />
						) : (
							<FaRegCommentAlt className={classes.icon} />
						)}
					</div>
				</div>
			</li>
			{displayNewReply && (
				<NewPostComment
					token={token!}
					userID={userID!}
					parentID={commentID}
					actionType="createCommentReply"
					setDisplayNewComment={setDisplayNewReply}
				/>
			)}
			{childCommentIDs &&
				childCommentIDs.map((item) => (
					<PostCommentItem
						key={item._id}
						comment={item}
						className={classes.reply}
					/>
				))}
		</div>
	);
};

export default PostCommentItem;
