import React, { useEffect, useRef } from "react";
import classes from "./NotificationsMenu.module.css";
import NotificationsItem from "./NotificationsItem";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { fetchNotifications } from "../../../store/notificationsThunks";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import getToken from "../../../util/getToken";
import { FadeLoader } from "react-spinners"; //animated loader component
import { readAllNotification } from "../../../store/notificationsThunks";
import { MenuDisplayStateType } from "./Notifications";

type Props = {
	isNoNewNotifications: boolean; //parent's boolean no new notifications state
	setMenuDisplayState: (menuDisplayState: any) => any;
	children?: React.ReactNode;
};

//menu component for the notifications modal, containing the notifications list and mark all as read. also fetchs notifications data from DB
const NotificationsMenu: React.FC<Props> = function (props) {
	const hadInitialFetch = useRef<boolean>(false); //for dev env
	const scrollRef = useRef<any>();
	const isFetching = useRef(false);
	const token = getToken(); //JWT token
	const { notifications, lastItemTimestamp, isNoMoreItems, isLoading } =
		useSelector((state: RootState) => state.notifications);
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function

	//initial notifications data fetch from DB, executed once on mount
	useEffect(() => {
		if (
			import.meta.env.PROD ||
			(!hadInitialFetch.current && notifications.length === 0)
		) {
			dispatch(fetchNotifications(token!, false));
		}
		hadInitialFetch.current = true; //For dev env
	}, []);

	//set parent's no new notifications to true when conditions are met, executed on notifications array update
	useEffect(() => {
		if (
			hadInitialFetch.current === true && //has initial data fetched
			notifications.length > 0 && //has some notifications
			hasNonRead === false && //has no unread notifications
			props.isNoNewNotifications === false
		) {
			//set parent's no new notifications state to true
			props.setMenuDisplayState(
				(prevState: MenuDisplayStateType): MenuDisplayStateType => ({
					...prevState,
					isNoNewNotifications: true,
				})
			);
		}
	}, [notifications]);

	//infinite scrolling logic
	useEffect(() => {
		const simpleBarInstance = scrollRef.current.getScrollElement();
		const threshold = 350;

		const handleScroll = function () {
			if (!isFetching.current) {
				const { scrollTop, scrollHeight, clientHeight } = simpleBarInstance;

				//if bottom treashold reached, fetch more posts
				if (scrollTop + clientHeight >= scrollHeight - threshold) {
					isFetching.current = true;

					dispatch(fetchNotifications(token!, isNoMoreItems, lastItemTimestamp))
						.catch((err) =>
							console.error(
								`ERROR fetching infinite scroll next batch: ${err.message}`
							)
						)
						//set 200ms cooldown between executions
						.finally(() => {
							setTimeout(() => {
								isFetching.current = false;
							}, 200);
						});
				}
			}
		};

		// re-add scroll listener
		simpleBarInstance.addEventListener("scroll", handleScroll);
		return () => simpleBarInstance.removeEventListener("scroll", handleScroll);
	}, [scrollRef, lastItemTimestamp]);

	//check if there is at least one new notification
	const hasNonRead = notifications?.some(
		(notificationItem) => notificationItem?.isRead === false
	);

	//mark all notifications as read button handler function
	const readAllHandler = function () {
		//check if at least one notification is not read
		if (hasNonRead) {
			dispatch(readAllNotification(token!));
		}
		props.setMenuDisplayState({
			isNoNewNotifications: true,
			oldNotificationsClick: false,
		});
	};

	return (
		<div className={classes.notifications}>
			<div className={classes["top-container"]}>
				<h2 className={classes.header}>Notifications</h2>
				<button
					className={classes["read-all"]}
					type="button"
					onClick={readAllHandler}
				>
					Mark all as read
				</button>
			</div>
			<SimpleBar
				style={{
					position: "relative",
					width: "100%",
					maxHeight: "calc(100% - 4rem)",
				}}
				ref={scrollRef}
			>
				<div className={classes.body}>
					{notifications?.map((item) => (
						<NotificationsItem key={item._id} notificationItem={item} />
					))}
					{isLoading && (
						<div className={classes.loader}>
							<FadeLoader
								color="#000000"
								height={10}
								margin={-4}
								radius={2}
								speedMultiplier={2}
								width={5}
							/>
						</div>
					)}
					{isNoMoreItems && (
						<h4 className={classes["no-more-notifications"]}>
							No more notifications.
						</h4>
					)}
				</div>
			</SimpleBar>
		</div>
	);
};

export default NotificationsMenu;
