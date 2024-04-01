import React, { Fragment, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchSocialList } from "../../store/userThunks";
import SocialRequestItem from "./SocialRequestItem";
import getToken from "../../util/getToken";

type Props = {
	children?: React.ReactNode;
};

//container component for pending friend requests, also fetches them from DB
const SocialRequests: React.FC<Props> = function (props) {
	const token = getToken(); //JWT token
	const { friendRequestsList } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const hasRun = useRef<boolean>(false); //for dev env

	//fetch friend requests, executed once when the app reload
	useEffect(() => {
		if (import.meta.env.PROD || !hasRun.current) {
			dispatch(fetchSocialList(token!, "friendRequestsList"));
		}
		hasRun.current = true; //For dev env
	}, []);

	return (
		<Fragment>
			{friendRequestsList
				?.filter((item) => item.connection.status === "awaiting response")
				?.map((item) => {
					return (
						<SocialRequestItem
							key={item._id}
							requestingUser={item.friendRequest}
						/>
					);
				})}
		</Fragment>
	);
};

export default SocialRequests;
