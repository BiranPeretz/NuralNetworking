import React, { Fragment } from "react";
import classes from "./ProfilePicture.module.css";
import { PiUserCircleDuotone } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type Props = {
	className?: string;
	src?: string;
	ignoreDefaultSrc?: boolean;
	alt?: string;
	style?: Object;
};

function validateImageURL(imageURL: string): boolean {
	const cloudinaryUrlPattern =
		/^https?:\/\/res\.cloudinary\.com\/[a-z0-9]+\/image\/upload\/.+$/;
	return cloudinaryUrlPattern.test(imageURL);
}

//Project's replacement <img/> tag for user profile picture
const ProfilePicture: React.FC<Props> = function ({
	className,
	src,
	ignoreDefaultSrc,
	alt,
	style,
}) {
	let imageStr = src;

	if (!ignoreDefaultSrc) {
		imageStr = useSelector((state: RootState) => state.user.profilePicture);
	}
	const isValidImage: boolean = validateImageURL(imageStr || "");

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
