import React, { useState } from "react";
import classes from "./NotificationsItem.module.css";
import notificationType from "../../../types/notification";
import postType, { postContentType } from "../../../types/post";
import commentType from "../../../types/comment";
import socialItemType from "../../../types/socialItem";
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { readNotification } from "../../../store/notificationsThunks";
import getToken from "../../../util/getToken";
const getNotificationMessage = function (notificationItem: notificationType) {
	const {
		userID,
		notificationType,
		initiatorType,
		initiatorID,
		initiatingUserID,
	} = notificationItem;
	let message: string = ``;
	const CONTENT_TRESHOLD: number = 13;

	switch (notificationType) {
		case "like": //initiator type could be "Post" or "Comment"
		case "comment":
			let initiatorContent: string = "";
			if (initiatorType === "Post") {
				const _ = initiatorID as postType;
				initiatorContent = _.content?.text!;
			} else {
				const _ = initiatorID as commentType;
				initiatorContent = _.content;
			}
			initiatorContent =
				initiatorContent.length > CONTENT_TRESHOLD
					? initiatorContent.substring(0, CONTENT_TRESHOLD - 3) + "..."
					: initiatorContent;
			message = `${
				notificationType === "like" ? "liked" : "replied to"
			} your ${initiatorType?.toLowerCase()} "${initiatorContent}".`;
			break;
		case "friend request":
			message = "sent you a friend request.";
			break;
		case "new friend":
			message = "is now you friend.";
			break;
		case "new member": {
			const initiatorTyped = initiatorID as socialItemType;
			message = `has joined your group ${initiatorTyped.name}.`;
			break;
		}
		case "new follower": {
			const initiatorTyped = initiatorID as socialItemType;
			message = `is now following your page ${initiatorTyped.name}.`;
			break;
		}
	}

	return message;
};

type Props = {
	notificationItem: notificationType;
	children?: React.ReactNode;
};

const NotificationsItem: React.FC<Props> = function (props) {
	const token = getToken();
	const dispatch = useDispatch<AppDispatch>();
	const [isRead, setIsRead] = useState<boolean | null>(
		props.notificationItem.isRead
	);
	const message = getNotificationMessage(props.notificationItem);
	const readNotificationHandler = function () {
		if (!isRead) {
			dispatch(
				readNotification(token!, props.notificationItem._id!.toString())
			);
		}
		setIsRead(true);
	};
	return (
		<li className={classes.item} key={props.notificationItem._id}>
			<img
				src={
					props.notificationItem.initiatingUserID?.profilePicture ||
					"https://randomuser.me/api/portraits/thumb/men/76.jpg"
				}
			/>
			<h4>
				<span>
					{props.notificationItem?.initiatingUserID?.name || "Someone"}
				</span>{" "}
				{message}
			</h4>
			<div className={classes.icon}>
				{isRead ? (
					<FaRegEnvelopeOpen onClick={readNotificationHandler} />
				) : (
					<FaRegEnvelope color="#eeab05" onClick={readNotificationHandler} />
				)}
			</div>
		</li>
	);
};

export default NotificationsItem;
