import React, { Fragment } from "react";
import classes from "./ProfilePicture.module.css";
import { PiUserCircleDuotone } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type Props = {
	className?: string; //additional className attribute
	src?: string; //img's tag src attribute
	ignoreDefaultSrc?: boolean; //boolean value to ignore the default src that is fetched from the user's local store data
	alt?: string; //img's tag alt attribute
	style?: Object; //additional css style attribute
};

//util function that preform basic image URL validations to the app's images source. images on this app are uploaded to cloudinary and this function will filter any images from other places. function take the image src string as parameter
function validateImageURL(imageURL: string): boolean {
	const cloudinaryUrlPattern =
		/^https?:\/\/res\.cloudinary\.com\/[a-z0-9]+\/image\/upload\/.+$/; //regex expression to ensure src is an cloudinary link
	return cloudinaryUrlPattern.test(imageURL); //return validation results as boolean
}

//generic component that replace the <img/> tag in this app where profile picture of some instance is need to be rendered. has basic image URL validations and pre-made css classes. also has profile picture icon as fallback for curropted images
const ProfilePicture: React.FC<Props> = function ({
	className,
	src,
	ignoreDefaultSrc,
	alt,
	style,
}) {
	let imageStr = src; //initialize src string

	if (!ignoreDefaultSrc) {
		//if we dont want to ignore the default user's profile picture (AKA we want to display the user's profile picture)
		imageStr = useSelector((state: RootState) => state.user.profilePicture); //set image src as the user's profile picture stored in local store
	}
	const isValidImage: boolean = validateImageURL(imageStr || ""); //boolean value of src string validation results

	return (
		<Fragment>
			{isValidImage ? (
				<img
					className={`${classes.image} ${className || ""}`}
					src={imageStr}
					alt={alt || "User's profile picture."}
					style={style}
				/>
			) : (
				<PiUserCircleDuotone
					className={`${classes.icon} ${className || ""}`}
					style={style}
				/>
			)}
		</Fragment>
	);
};

export default ProfilePicture;
