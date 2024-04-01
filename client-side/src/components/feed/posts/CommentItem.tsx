import React from "react";
import classes from "./CommentItem.module.css";
import commentType from "../../../types/comment";
import { formatDistanceToNow } from "date-fns";
import ProfilePicture from "../../UI/ProfilePicture";
import SocialInteractions from "./SocialInteractions";

type Props = {
	comment: commentType; //the comment to display
	className?: string;
};

//comment on a post component
const CommentItem: React.FC<Props> = function (props) {
	const {
		_id: commentID,
		userID: commentUserID,
		timestamp,
		content,
		childCommentIDs,
		likeList,
	} = props.comment;

	const isParentComment = childCommentIDs && childCommentIDs?.length > 0; //if the comment has child comments

	return (
		<div className={`${classes["comment-wrapper"]} ${props?.className || ""}`}>
			<div
				className={`${classes.comment} ${
					isParentComment ? classes["parent-comment"] : ""
				}`}
			>
				<ProfilePicture
					className={classes["user-picture"]}
					src={commentUserID?.profilePicture}
					ignoreDefaultSrc={true}
				/>
				<div className={classes["content-wrapper"]}>
					<div className={classes.content}>
						<div className={classes["content__header"]}>
							<h3 className={classes["header__user-name"]}>
								{commentUserID.name}
							</h3>
							<h5 className={classes.timestamp}>
								{formatDistanceToNow(new Date(timestamp)).replace("about ", "")}
							</h5>
						</div>
						<p className={classes["content__body"]}>{content}</p>
					</div>
					<SocialInteractions
						itemID={commentID}
						likeList={likeList || []}
						commentList={childCommentIDs || []}
						model="comments"
						containerClassname={classes["interactions-wrapper"]}
						interactionClassname={classes.interaction}
						engagementsClassname={classes.engagements}
					/>
				</div>
			</div>
			{childCommentIDs &&
				childCommentIDs.map((item, i) => (
					<CommentItem
						key={item._id}
						comment={item}
						className={`${classes.reply} ${
							i === childCommentIDs.length - 1 ? classes["last-reply"] : ""
						}`}
					/>
				))}
		</div>
	);
};

export default CommentItem;
