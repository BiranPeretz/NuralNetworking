import React, { Fragment } from "react";
import classes from "./RectangleButton.module.css";

type Props = {
	name: string;
	type?: "button" | "submit" | "reset";
	value?: string;
	id?: string;
	className?: string;
	children?: React.ReactNode;
	style?: Object;
	onClick?: () => void;
};

const RectangleButton: React.FC<Props> = function (props) {
	return (
		<button
			id={props.id}
			name={props.name}
			type={props.type}
			value={props.type}
			className={`${classes.container} ${props.className || ""}`}
			style={props.style}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

export default RectangleButton;
