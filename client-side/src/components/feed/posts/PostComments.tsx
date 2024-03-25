import React from "react";
import classes from "./PostComments.module.css";
import commentType from "../../../types/comment";
import CommentItem from "./CommentItem";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

type Props = {
	comments: commentType[];
	children?: React.ReactNode;
};

const PostComments: React.FC<Props> = function (props) {
	const commentsList = props?.comments;
	if (!commentsList || commentsList.length <= 0) {
		return (
			<h3 className={classes["no-comments"]}>Dataset Status: Unpopulated.</h3>
		);
	}

	return (
		<div className={classes.comments}>
			<SimpleBar
				style={{
					height: `100%`,
					maxHeight: "500px",
					overflowY: "auto",
				}}
			>
				<ul className={classes["comments-list"]}>
					{commentsList.map((item) => (
						<CommentItem key={item._id} comment={item} />
					))}
				</ul>
			</SimpleBar>
		</div>
	);
};

export default PostComments;
