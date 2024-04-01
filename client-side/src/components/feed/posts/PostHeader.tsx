import React from "react";
import classes from "./PostHeader.module.css";
import socialItemType from "../../../types/socialItem";
import { formatDistanceToNow } from "date-fns";
import SocialItem from "../../UI/SocialItem";

type Props = {
	creator: socialItemType;
	author?: socialItemType;
	postTimestamp?: Date;
};

//header of a Post component, containing the creator name+profile picture and the post's host name (if there's an host)
const PostHeader: React.FC<Props> = function (props) {
	return (
		<div className={classes.header}>
			<SocialItem
				pictureSrc={props?.creator?.profilePicture || ""}
				name={props?.creator?.name! || ""}
				subText={props?.author?.name || undefined}
			/>
			{props.postTimestamp && (
				<h5 className={classes.timestamp}>{`${formatDistanceToNow(
					new Date(props.postTimestamp)
				)} ago`}</h5>
			)}
		</div>
	);
};

export default PostHeader;
