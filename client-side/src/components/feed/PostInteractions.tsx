import React, { useState, Fragment } from "react";
import classes from "./PostInteractions.module.css";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaCommentAlt, FaRegCommentAlt } from "react-icons/fa";
import { BsFillShareFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { likeAndUnlike } from "../../store/postsThunks";
import likeType from "../../types/like";
import postType from "../../types/post";
import NewPostComment from "./NewPostComment";
import getToken from "../../util/getToken";

type Props = {
	postID: string;
	children?: React.ReactNode;
};

const getIsLiked = function (
	userID: string,
	postID: string,
	posts: postType[]
): boolean {
	const post = posts.find((item) => item._id === postID);

	return post?.likeList?.some((item) => item.user._id === userID) as boolean;
};

const PostInteractions: React.FC<Props> = function (props) {
	const { _id: userID, profilePicture } = useSelector(
		(state: RootState) => state.user
	);
	const token = getToken();
	const { posts } = useSelector((state: RootState) => state.post);
	const dispatch = useDispatch<AppDispatch>();
	const [isLiked, setIsLiked] = useState<boolean>(
		getIsLiked(userID!, props.postID, posts)
	);
	const [displayNewComment, setDisplayNewComment] = useState<boolean>(false);

	const likeButtonClickHandler = function (event: React.MouseEvent) {
		event.preventDefault();
		if (isLiked) {
			//unlike
			dispatch(likeAndUnlike(token!, props.postID, "unlike", "posts"));
			setIsLiked(false);
		} else {
			//like
			dispatch(likeAndUnlike(token!, props.postID, "like", "posts"));
			setIsLiked(true);
		}
	};

	const commentIconClickHandler = function () {
		setDisplayNewComment((prevState) => !prevState);
	};

	return (
		<Fragment>
			<div className={classes.interactions}>
				<button
					name="like"
					className={classes["interaction__button"]}
					onClick={likeButtonClickHandler}
				>
					{isLiked ? (
						<BiSolidLike className={classes.icon} />
					) : (
						<BiLike className={classes.icon} />
					)}
					Like
				</button>
				<button
					name="comment"
					className={classes["interaction__button"]}
					onClick={commentIconClickHandler}
				>
					{displayNewComment ? (
						<FaCommentAlt className={classes.icon} />
					) : (
						<FaRegCommentAlt className={classes.icon} />
					)}
					Comment
				</button>
				<button name="share" className={classes["interaction__button"]}>
					<BsFillShareFill className={classes.icon} />
					Share
				</button>
			</div>
			{displayNewComment && (
				<NewPostComment
					token={token!}
					userID={userID!}
					parentID={props.postID}
					actionType="createComment"
					setDisplayNewComment={setDisplayNewComment}
				/>
			)}
		</Fragment>
	);
};

export default PostInteractions;
