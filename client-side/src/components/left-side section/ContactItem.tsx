import React from "react";
import classes from "./ContactItem.module.css";
import socialItemType from "../../types/socialItem";
import {
	friendConnectionType,
	groupConnectionType,
	pageConnectionType,
} from "../../types/user";
import { formatDistanceToNow } from "date-fns"; //return the difference between past date and now with appropriate time units as string. for example: "3 minuts", "8 hours", "about two years" etc.
import SocialItem from "../UI/SocialItem";

type props = {
	contactItem: friendConnectionType | groupConnectionType | pageConnectionType; //contains data about the connection between the contact and the user + cantact's data
	contactType: "friend" | "group" | "page";
};

//contact (an friend, participated group or owned page) item component, containing the contact's information
const ContactItem: React.FC<props> = function (props) {
	let contactItemData: socialItemType;
	let connectedMsg; //string that quantify the connetion time between the user and the contact
	switch (props.contactType) {
		case "friend":
			const _ = props.contactItem as friendConnectionType; //temp variable for typescript
			contactItemData = _?.friend;
			connectedMsg = `Friends for ${formatDistanceToNow(
				new Date(props.contactItem?.connection?.timestamp)
			)}`;
			break;
		case "group":
			const __ = props.contactItem as groupConnectionType; //temp variable for typescript
			contactItemData = __?.group;
			connectedMsg = `Joined ${formatDistanceToNow(
				new Date(props.contactItem?.connection?.timestamp)
			)} ago`;
			break;
		case "page":
			const ___ = props.contactItem as pageConnectionType; //temp variable for typescript
			contactItemData = ___?.page;
			connectedMsg = `Followed ${formatDistanceToNow(
				new Date(props.contactItem?.connection?.timestamp)
			)} ago`;
			break;
	}

	return (
		<li className={classes.item} key={props.contactItem?._id}>
			<SocialItem
				pictureSrc={contactItemData?.profilePicture}
				name={contactItemData?.name!}
				subText={connectedMsg}
			/>
		</li>
	);
};

export default ContactItem;
