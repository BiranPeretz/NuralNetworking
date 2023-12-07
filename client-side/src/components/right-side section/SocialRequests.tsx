import React, { Fragment, useEffect, useRef } from "react";
import classes from "./SocialRequests.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchSocialList } from "../../store/userThunks";
import SocialRequestItem from "./SocialRequestItem";
import getToken from "../../util/getToken";

type Props = {
	children?: React.ReactNode;
};

const SocialRequests: React.FC<Props> = function (props) {
	const token = getToken();
	const { friendRequestsList } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>();
	const hasRun = useRef<boolean>(false);
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
