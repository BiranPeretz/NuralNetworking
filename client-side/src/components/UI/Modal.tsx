import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import Card from "./Card";
import Backdrop from "./Backdrop";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
	className?: string;
	backdropClassName?: string;
	children?: React.ReactNode;
	title?: string;
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
				className={
					props.className
						? `${classes.modal} ${props.className}`
						: classes.modal
				}
			>
				{props.title ? (
					<div className={classes["modal__title"]}>
						<h2>{props.title}</h2>
					</div>
				) : undefined}

				<AiOutlineClose
					className={classes["close-button"]}
					size="1.4rem"
					onClick={props.onClose}
				></AiOutlineClose>
				<div className={classes["modal__body"]}>{props.children}</div>
			</Card>
		</Fragment>
	);
};

export default Modal;
