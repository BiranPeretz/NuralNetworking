import React, { useState } from "react";
import classes from "./NotificationsItem.module.css";
import notificationType from "../../../types/notification";
import getNotificationMessage from "../../../util/getNotificationMessage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { readNotification } from "../../../store/notificationsThunks";
import getToken from "../../../util/getToken";
import ProfilePicture from "../../UI/ProfilePicture";
import EnvelopeIcon from "../../../assets/icons/Envelope";
import EnvelopeOpenIcon from "../../../assets/icons/EnvelopeOpen";

type Props = {
	notificationItem: notificationType;
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
		<li
			className={`${classes.item} ${isRead ? classes.read : ""}`}
			key={props.notificationItem._id}
		>
			<ProfilePicture
				className={classes.image}
				src={props.notificationItem.initiatingUserID?.profilePicture}
				ignoreDefaultSrc={true}
			/>
			<h4 className={classes.message}>
				<span className={classes.name}>
					{props.notificationItem?.initiatingUserID?.name || "Someone"}
				</span>{" "}
				{message}
			</h4>
			<div className={classes.icon}>
				{isRead ? (
					<EnvelopeOpenIcon />
				) : (
					<EnvelopeIcon onClick={readNotificationHandler} />
				)}
			</div>
		</li>
	);
};

export default NotificationsItem;
