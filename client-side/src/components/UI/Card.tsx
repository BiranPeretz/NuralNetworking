import React, { CSSProperties } from "react";
import classes from "./Card.module.css";

type Props = {
	className?: string;
	title?: string;
	style?: CSSProperties;
	children?: React.ReactNode;
	onClick?: () => void;
};

const Card: React.FC<Props> = function (props) {
	return (
		<div
			className={`${classes.card} ${props.className || ""}`}
			style={props.style}
			onClick={props.onClick}
		>
			{props.title && <h2 className={classes["card__title"]}>{props.title}</h2>}
			{props.children}
		</div>
	);
};

export default Card;
