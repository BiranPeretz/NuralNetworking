import React from "react";
import classes from "./Backdrop.module.css";

type Props = {
	className?: string;
	children?: React.ReactNode;
	backdropClick: () => void;
};

const Backdrop: React.FC<Props> = function (props) {
	return (
		<div className={classes.backdrop} onClick={props.backdropClick}>
			{props.children}
		</div>
	);
};

export default Backdrop;
