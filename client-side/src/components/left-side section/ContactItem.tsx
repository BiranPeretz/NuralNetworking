import React from "react";
import classes from "./ContactItem.module.css";
import socialItemType from "../../types/socialItem";
import {
	friendConnectionType,
	groupConnectionType,
	pageConnectionType,
} from "../../types/user";
import { formatDistanceToNow } from "date-fns";
import ProfilePicture from "../UI/ProfilePicture";
import SocialItem from "../UI/SocialItem";

type props = {
	socialItem: friendConnectionType | groupConnectionType | pageConnectionType;
	socialType: "friend" | "group" | "page";
};

const ContactItem: React.FC<props> = function (props) {
	let socialItemData: socialItemType;
	let connectedMsg;
	switch (props.socialType) {
		case "friend":
			const _ = props.socialItem as friendConnectionType;
			socialItemData = _?.friend;
			connectedMsg = `Friends for ${formatDistanceToNow(
				new Date(props.socialItem?.connection?.timestamp)
			)}`;
			break;
		case "group":
			const __ = props.socialItem as groupConnectionType;
			socialItemData = __?.group;
			connectedMsg = `Joined ${formatDistanceToNow(
				new Date(props.socialItem?.connection?.timestamp)
			)} ago`;
			break;
		case "page":
			const ___ = props.socialItem as pageConnectionType;
			socialItemData = ___?.page;
			connectedMsg = `Followed ${formatDistanceToNow(
				new Date(props.socialItem?.connection?.timestamp)
			)} ago`;
			break;
	}

	return (
		<li className={classes.item} key={props.socialItem?._id}>
			<SocialItem
				pictureSrc={socialItemData?.profilePicture}
				name={socialItemData?.name!}
				subText={connectedMsg}
			/>
		</li>
	);
};

export default ContactItem;
