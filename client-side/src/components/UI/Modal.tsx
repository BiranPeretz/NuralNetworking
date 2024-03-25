import React, { CSSProperties, Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import Card from "./Card";
import Backdrop from "./Backdrop";
import CloseX from "../../assets/icons/CloseX";

type Props = {
	className?: string;
	backdropClassName?: string;
	children?: React.ReactNode;
	title?: string;
	style?: CSSProperties;
	onClose: () => void;
};

const Modal: React.FC<Props> = function (props) {
	return (
		<Fragment>
			{ReactDOM.createPortal(
				<Backdrop
					className={props.backdropClassName}
					backdropClick={props.onClose}
				/>,
				document.getElementById("root-overlay")!
			)}
			<Card
				style={props.style}
				className={
					props.className
						? `${classes.modal} ${props.className}`
						: classes.modal
				}
			>
				{props.title ? (
					<div className={classes["title__container"]}>
						<h2 className={classes.title}>{props.title}</h2>
					</div>
				) : undefined}

				<CloseX
					className={classes["close-button"]}
					onClick={props.onClose}
				></CloseX>
				{props.children}
			</Card>
		</Fragment>
	);
};

export default Modal;
