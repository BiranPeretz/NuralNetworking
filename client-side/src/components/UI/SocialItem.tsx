import React, { Fragment } from "react";
import classes from "./SocialItem.module.css";
import ProfilePicture from "./ProfilePicture";

type Props = {
	name: string; //name of the item, displayed as an h3 header tag
	NameClassname?: string; //additional name's h3 tag className attribute
	subText?: string; //displayed as h5 tag, text is displayed below name with lighter color
	subTextClassnameS?: string; //additional sub-text's h5 tag className attribute
	pictureClassName?: string; //attitional className attribute for the profile picture img tag
	pictureSrc?: string; //img's src attribute
	pictureAlt?: string; //img's alt attribute
	picturStyle?: Object; //additional styles for the img tag
	children?: React.ReactNode; //child component to display at the end(right-most) of the component
};

//generic component to display this app's social items(users groups and pages) as horizontal list item. contain the item's profile picture, name and optional sub-text to display below the name. could also have child components to be used in conjunction like action buttons, more data, etc. mostly used as a list item but could be standalone header or something else
const SocialItem: React.FC<Props> = function (props) {
	return (
		<Fragment>
			<ProfilePicture
				className={`${props.pictureClassName || ""}`}
				src={props.pictureSrc}
				ignoreDefaultSrc={true}
				alt={props.pictureAlt}
				style={props.picturStyle}
			/>
			<div className={classes["text-container"]}>
				<h3
					className={`${classes.name} ${props.NameClassname || ""} ${
						props?.subText ? "" : classes["no-sub-text"]
					}`}
				>
					{props.name}
				</h3>
				{props.subText && (
					<h5
						className={`${classes["sub-text"]} ${
							props.subTextClassnameS || ""
						}`}
					>
						{props.subText}
					</h5>
				)}
			</div>
			{props.children}
		</Fragment>
	);
};

export default SocialItem;
