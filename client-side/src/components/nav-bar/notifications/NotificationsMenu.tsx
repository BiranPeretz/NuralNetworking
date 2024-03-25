import React, { useEffect, useRef } from "react";
import classes from "./NotificationsMenu.module.css";
import NotificationsItem from "./NotificationsItem";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { fetchNotifications } from "../../../store/notificationsThunks";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import getToken from "../../../util/getToken";
import { FadeLoader } from "react-spinners";
import { readAllNotification } from "../../../store/notificationsThunks";
import { MenuDisplayStateType } from "./Notifications";

type Props = {
	isNoNewNotifications: boolean;
	setMenuDisplayState: (menuDisplayState: any) => any;
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

	useEffect(() => {
		if (
			hadInitialFetch.current === true &&
			notifications.length > 0 &&
			hasNonRead === false &&
			props.isNoNewNotifications === false
		) {
			props.setMenuDisplayState(
				(prevState: MenuDisplayStateType): MenuDisplayStateType => ({
					...prevState,
					isNoNewNotifications: true,
				})
			);
		}
	}, [notifications]);

	useEffect(() => {
		const simpleBarInstance = scrollRef.current.getScrollElement();
		const threshold = 350;

		const handleScroll = function () {
			if (!isFetching.current) {
				const { scrollTop, scrollHeight, clientHeight } = simpleBarInstance;

				if (scrollTop + clientHeight >= scrollHeight - threshold) {
					isFetching.current = true;

					dispatch(fetchNotifications(token!, isNoMoreItems, lastItemTimestamp))
						.catch((err) =>
							console.error(
								`ERROR fetching infinite scroll next batch: ${err.message}`
							)
						)
						.finally(() => {
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

	//check if there is at least one new notification
	const hasNonRead = notifications?.some(
		(notificationItem) => notificationItem?.isRead === false
	);

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
