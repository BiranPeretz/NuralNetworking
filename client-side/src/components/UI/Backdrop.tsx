import React from "react";
import classes from "./Backdrop.module.css";

type Props = {
	className?: string; //additional className attribute for the backdrop container
	children?: React.ReactNode;
	backdropClick: () => void; //backdrop mouse click function, usually close modal function
};

//generic backdrop component for the app, usually used with the Modal component and rendered on dedicated root html tag
const Backdrop: React.FC<Props> = function (props) {
	return (
		<div
			className={
				props.className
					? `${classes.backdrop} ${props.className}`
					: classes.backdrop
			} //combine generic + props custom classNames
			onClick={props.backdropClick}
		>
			{props.children}
		</div>
	);
};

export default Backdrop;
