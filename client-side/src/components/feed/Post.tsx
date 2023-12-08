import React from "react";
import classes from "./Post.module.css";
import postType from "../../types/post";
import Card from "../UI/Card";
import PostHeader from "./PostHeader";
import { formatDistanceToNow } from "date-fns";
import PostComments from "./PostComments";
import PostEngagements from "./PostEngagements";
import PostInteractions from "./PostInteractions";

type Props = {
	post: postType;
	children?: React.ReactNode;
};

const Post: React.FC<Props> = function (props) {
	const {
		_id,
		content,
		creatorType,
		creatorID,
		author,
		timestamp,
		likeList,
		commentsList,
	} = props.post;
	return (
		<Card className={classes.post}>
			<PostHeader
				className={classes["post__header"]}
				creatorID={creatorID!}
				author={author}
			>
				<div className={classes.date}>
					<h5>
						{timestamp && `${formatDistanceToNow(new Date(timestamp))} ago`}
					</h5>
				</div>
			</PostHeader>
			<div className={classes.content}>
				<p className={classes["content__text"]}>{content!.text}</p>
			</div>
			<PostEngagements />
			<PostInteractions postID={_id!} />
			<PostComments comments={commentsList} />
		</Card>
	);
};

export default Post;