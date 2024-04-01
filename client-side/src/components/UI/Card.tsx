import React, { CSSProperties } from "react";
import classes from "./Card.module.css";

type Props = {
	className?: string; //additional custom className attribute
	title?: string; //rendered as h2 header for the card
	style?: CSSProperties; //additional custom style attribute
	children?: React.ReactNode;
	onClick?: () => void;
};

//generic card component for the app. display its content on a card with white background and common premade css configuration.
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
