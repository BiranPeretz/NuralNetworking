import React from "react";
import classes from "./PostHeader.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import socialItemType from "../../types/socialItem";

type Props = {
	creatorID: socialItemType;
	author?: socialItemType;
	className?: string;
	children?: React.ReactNode;
};

const PostHeader: React.FC<Props> = function (props) {
	//TODO: add validation for curropted img (like string etc.)

	return (
		<div
			className={
				props.className
					? `${classes.header} ${props.className}`
					: classes.header
			}
		>
			{props.creatorID.profilePicture ? (
				<img src={props.creatorID.profilePicture} />
			) : (
				<FaRegUserCircle size="48px" />
			)}
			<div className={classes.identifiers}>
				<h2>{props.creatorID.name}</h2>
				{props.author && <h5>{props.author?.name}</h5>}
			</div>
			{props.children}
		</div>
	);
};

export default PostHeader;
