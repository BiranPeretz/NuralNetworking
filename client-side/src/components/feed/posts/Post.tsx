import React, { useState } from "react";
import classes from "./Post.module.css";
import postType from "../../../types/post";
import Card from "../../UI/Card";
import PostHeader from "./PostHeader";
import PostComments from "./PostComments";
import SocialInteractions from "./SocialInteractions";

type Props = {
	post: postType;
	children?: React.ReactNode;
};

//top level component of a post. diplay a card containing the sub-post components
const Post: React.FC<Props> = function (props) {
	const { _id, content, creatorID, author, timestamp, likeList, commentsList } =
		props.post;

	const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false); //post's image loading state
	const [isImageError, setIsImageError] = useState<boolean>(false); //post's image error state

	return (
		<Card className={classes.post}>
			<PostHeader
				creator={creatorID!}
				author={author}
				postTimestamp={timestamp}
			/>
			<div className={classes.content}>
				<p className={classes["content__text"]}>{content!.text}</p>
			</div>
			{content?.image && (
				<img
					className={classes.image}
					src={content?.image}
					alt="Post's image."
					onLoad={() => setIsImageLoaded(true)}
					onError={() => setIsImageError(true)}
					style={{
						display: isImageLoaded && !isImageError ? "block" : "none",
					}}
				/>
			)}
			<SocialInteractions
				itemID={_id!}
				likeList={likeList || []}
				commentList={commentsList}
				model="posts"
			/>
			<PostComments comments={commentsList} />
		</Card>
	);
};

export default Post;
