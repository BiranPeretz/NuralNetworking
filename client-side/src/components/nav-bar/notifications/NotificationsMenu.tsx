import React, { useEffect, useRef } from "react";
import classes from "./NotificationsMenu.module.css";
import Card from "../../UI/Card";
import NotificationsItem from "./NotificationsItem";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../../../store/notificationsThunks";
import type { RootState, AppDispatch } from "../../../store/store";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import getToken from "../../../util/getToken";
import { FadeLoader } from "react-spinners";
import { readAllNotification } from "../../../store/notificationsThunks";

type Props = {
	children?: React.ReactNode;
};

const NotificationsMenu: React.FC<Props> = function (props) {
	const hadInitialFetch = useRef<boolean>(false);
	const scrollRef = useRef<any>();
	const isFetching = useRef(false);
	const token = getToken();
	const { notifications, lastItemTimestamp, isNoMoreItems, isLoading } =
		useSelector((state: RootState) => state.notifications);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (
			import.meta.env.PROD ||
			(!hadInitialFetch.current && notifications.length === 0)
		) {
			dispatch(fetchNotifications(token!, false));
		}
		hadInitialFetch.current = true; //For dev env
	}, []);

	const handleFetchNotifications = function () {
		dispatch(fetchNotifications(token!, isNoMoreItems, lastItemTimestamp));
	};

	useEffect(() => {
		const simpleBarInstance = scrollRef.current.getScrollElement();
		const threshold = 350;

		const handleScroll = function () {
			if (!isFetching.current) {
				const { scrollTop, scrollHeight, clientHeight } = simpleBarInstance;

				if (scrollTop + clientHeight >= scrollHeight - threshold) {
					isFetching.current = true;

					console.log(lastItemTimestamp);
					console.log(notifications);
					// Fetch more data from your server here
					dispatch(fetchNotifications(token!, isNoMoreItems, lastItemTimestamp))
						.catch((err) =>
							console.error(
								`ERROR fetching infinite scroll next batch: ${err.message}`
							)
						)
						.finally(() => {
							// Re-add the scroll listener after the desired cooldown
							setTimeout(() => {
								isFetching.current = false;
							}, 200);
						});
				}
			}
		};

		simpleBarInstance.addEventListener("scroll", handleScroll);
		return () => simpleBarInstance.removeEventListener("scroll", handleScroll);
	}, [scrollRef, lastItemTimestamp]);

	const readAllHandler = function () {
		//check if at least one notification is not read
		if (
			notifications?.some(
				(notificationItem) => notificationItem?.isRead === false
			)
		) {
			dispatch(readAllNotification(token!));
		}
	};

	return (
		<Card className={classes.notifications}>
			<div className={classes.header}>
				<h2>Notifications</h2>
				<button
					className={classes["read-all"]}
					type="button"
					onClick={readAllHandler}
				>
					read all
				</button>
			</div>
			<SimpleBar
				style={{
					position: "relative",
					width: "100%",
					maxHeight: "87%",
				}}
				ref={scrollRef}
			>
				<div className={classes.body}>
					{notifications?.map((item) => (
						<NotificationsItem key={item._id} notificationItem={item} />
					))}
					{!isLoading && !isNoMoreItems && (
						<button onClick={handleFetchNotifications}>more</button>
					)}

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
					{isNoMoreItems && <h5>No more notifications.</h5>}
				</div>
			</SimpleBar>
		</Card>
	);
};

export default NotificationsMenu;
