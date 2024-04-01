import React, { CSSProperties, Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import Card from "./Card";
import Backdrop from "./Backdrop";
import CloseX from "../../assets/icons/CloseX";

type Props = {
	className?: string; //additional className atribute
	backdropClassName?: string; //additionall passed to the Backdrop component
	children?: React.ReactNode;
	title?: string; //text to display as the modal's header
	style?: CSSProperties; //additionall css style attribute
	onClose: () => void;
};

//generic modal component for this app. tipically renered on dedicated root html tag via portal, also display a Backdrop component to blur the rest of the content. has premade css classes and this component is commonly used in the app. the modal's content is contained within a Card component and has dedicated custom title
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
