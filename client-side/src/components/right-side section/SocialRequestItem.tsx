import React from "react";
import classes from "./SocialRequestItem.module.css";
import Card from "../UI/Card";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import socialItemType from "../../types/socialItem";
import {
	acceptFriendRequest,
	rejectFriendRequest,
} from "../../store/userThunks";
import getToken from "../../util/getToken";
import ProfilePicture from "../UI/ProfilePicture";

type Props = {
	requestingUser: socialItemType;
	children?: React.ReactNode;
};

const SocialRequestItem: React.FC<Props> = function (props) {
	const token = getToken();
	const dispatch = useDispatch<AppDispatch>();

	const acceptRequestHandler = function () {
		dispatch(acceptFriendRequest(token!, props.requestingUser._id!));
	};

	const declineRequestHandler = function () {
		dispatch(rejectFriendRequest(token!, props.requestingUser._id!));
	};

	return (
		<Card className={classes.request}>
			<div className={classes.content}>
				<ProfilePicture
					src={props.requestingUser.profilePicture}
					ignoreDefaultSrc={true}
				/>
				<h4 className={classes.message}>
					<span className={classes.name}>{props.requestingUser.name}</span> sent
					<br />
					you a friend request.
				</h4>
			</div>
			<div className={classes.buttons}>
				<button
					className={classes.accept}
					name="Accept"
					onClick={acceptRequestHandler}
				>
					Accept
				</button>
				<button
					className={classes.decline}
					name="Decline"
					onClick={declineRequestHandler}
				>
					Decline
				</button>
			</div>
		</Card>
	);
};

export default SocialRequestItem;
