import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./NotificationsModal.module.css";
import Backdrop from "../../UI/Backdrop";
import Card from "../../UI/Card";

type Props = {
	positionCoords: { x: number; y: number }; //the center coordinates of the notifications icon
	onClose: () => void;
	children?: React.ReactNode;
};

//custom modal component for notifications, displays a backdrop and one of the notification menus appropriately
const NotificationsModal: React.FC<Props> = function (props) {
	return (
		<Fragment>
			{ReactDOM.createPortal(
				<Backdrop className={classes.backdrop} backdropClick={props.onClose} />,
				document.getElementById("root-overlay")!
			)}
			{ReactDOM.createPortal(
				<Card
					className={classes.modal}
					style={{
						left: `${props.positionCoords.x.toString()}px`,
						top: `${(props.positionCoords.y + 41).toString()}px`,
					}}
				>
					<div className={classes["arrow-border"]}></div>
					<div className={classes.arrow}></div>
					<div>{props.children}</div>
				</Card>,
				document.getElementById("root-overlay")!
			)}
		</Fragment>
	);
};

export default NotificationsModal;
