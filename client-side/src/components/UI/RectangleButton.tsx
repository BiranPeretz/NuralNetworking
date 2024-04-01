import React from "react";
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

//generic component for styled button in the app. replace the html button tag with custom rectangle button and some pre-made css styles
const RectangleButton: React.FC<Props> = function (props) {
	return (
		<button
			id={props.id}
			name={props.name}
			type={props.type}
			value={props.value}
			className={`${classes.container} ${props.className || ""}`}
			style={props.style}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

export default RectangleButton;
