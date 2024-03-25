import React, { Fragment } from "react";
import classes from "./SocialItem.module.css";
import ProfilePicture from "./ProfilePicture";

type Props = {
	name: string;
	NameClassname?: string;
	subText?: string;
	subTextClassnameS?: string;
	pictureClassName?: string;
	pictureSrc?: string;
	pictureAlt?: string;
	picturStyle?: Object;
	children?: React.ReactNode;
};
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
