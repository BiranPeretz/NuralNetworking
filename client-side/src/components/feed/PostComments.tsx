import React from "react";
import classes from "./PostComments.module.css";
import commentType from "../../types/comment";
import PostCommentItem from "./PostCommentItem";

type Props = {
	comments: commentType[];
	children?: React.ReactNode;
};

const PostComments: React.FC<Props> = function (props) {
	const commentsList = props.comments;
	if (!commentsList || commentsList.length <= 0) {
		return (
			<h3 className={classes["no-comments"]}>No comments for this post.</h3>
		);
	}

	return (
		<div className={classes.comments}>
			<ul className={classes["comments-list"]}>
				{commentsList.map((item) => (
					<PostCommentItem key={item._id} comment={item} />
				))}
			</ul>
		</div>
	);
};

export default PostComments;
