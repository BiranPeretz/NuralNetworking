import React from "react";
import classes from "./NoNotificationsMenu.module.css";
import NoNotifications from "../../../assets/NoNotifications.png";
import { MenuDisplayStateType } from "./Notifications";

type Props = {
	setMenuDisplayState: (menuDisplayState: any) => any;
};

//component of the menu displayed on the notifications modal when there are no new notifications
const NoNotificationsMenu: React.FC<Props> = function (props) {
	//display (old) notifications menu button handler funnction
	const displayOldNotificationsHandler = function () {
		props.setMenuDisplayState(
			(prevState: MenuDisplayStateType): MenuDisplayStateType => ({
				...prevState,
				oldNotificationsClick: true,
			})
		);
	};
	return (
		<div className={classes.container}>
			<img
				className={classes.image}
				src={NoNotifications}
				alt="Tree of connected nodes."
			/>
			<h2 className={classes.text}>No new notifications</h2>
			<h5 className={classes["sub-text"]}>
				We'll notify you when something new arrives!
			</h5>
			<button
				className={classes["old-notifications"]}
				onClick={displayOldNotificationsHandler}
			>
				Show old notifications
			</button>
		</div>
	);
};

export default NoNotificationsMenu;
