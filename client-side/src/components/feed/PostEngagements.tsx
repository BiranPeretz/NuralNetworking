import React from "react";
import classes from "./PostEngagements.module.css";
import { BiLike } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";

type Props = {
	children?: React.ReactNode;
};

//TODO: add likes and comments amount to icons
const PostEngagements: React.FC<Props> = function (props) {
	return (
		<div className={classes.engagements}>
			<div className={classes["engagement__item"]}>
				<div className={classes["icon__container"]}>
					<BiLike className={classes.icon} />
				</div>
				<h6>Likes</h6>
			</div>
			<div className={classes["engagement__item"]}>
				<h6>Comments</h6>
				<div className={classes["icon__container"]}>
					<LiaCommentSolid className={classes.icon} />
				</div>
			</div>
		</div>
	);
};

export default PostEngagements;
