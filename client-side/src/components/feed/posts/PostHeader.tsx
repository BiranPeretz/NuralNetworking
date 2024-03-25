import React from "react";
import classes from "./PostHeader.module.css";
import socialItemType from "../../../types/socialItem";
import { formatDistanceToNow } from "date-fns";
import SocialItem from "../../UI/SocialItem";

type Props = {
	creatorID: socialItemType;
	author?: socialItemType;
	postTimestamp?: Date;
};

const PostHeader: React.FC<Props> = function (props) {
	return (
		<div className={classes.header}>
			<SocialItem
				pictureSrc={props.creatorID.profilePicture}
				name={props.creatorID.name!}
				subText={props.author?.name || undefined}
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
