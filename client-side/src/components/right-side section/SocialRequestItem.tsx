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
			<div className={classes.message}>
				<img src={props.requestingUser.profilePicture} />
				<h5>
					<span className={classes.name}>{props.requestingUser.name}</span> sent
					you a friend request.
				</h5>
			</div>
			<div className={classes.buttons}>
				<button name="Accept" onClick={acceptRequestHandler}>
					Accept
				</button>
				<button name="Decline" onClick={declineRequestHandler}>
					Decline
				</button>
			</div>
		</Card>
	);
};

export default SocialRequestItem;
