import notificationType from "../types/notification";
import {
	clearNotificationsData,
	fetchNotificationsStart,
	fetchNotificationsSuccess,
	fetchNotificationsFail,
	setReadNotification,
	setReadAllNotification,
} from "./notificationsSlice";

export const fetchNotifications = function (
	token: string,
	isNoMoreItems: boolean,
	lastItemTimestamp?: string
) {
	return async function (dispatch: any) {
		if (isNoMoreItems) {
			return;
		}
		dispatch(fetchNotificationsStart());

		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`notifications/getMyNotifications?limit=5${
						lastItemTimestamp ? "&lastItemTimestamp=" + lastItemTimestamp : ""
					}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			console.log(response);
			console.log(data);
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			data.data.forEach((item: any) => {
				if (item.userID.fullName) {
					item.userID.name = item.userID.fullName;
					delete item.userID.fullName;
				}
				if (item.initiatorID.fullName) {
					item.initiatorID.name = item.initiatorID.fullName;
					delete item.initiatorID.fullName;
				}
				if (item.initiatingUserID.fullName) {
					item.initiatingUserID.name = item.initiatingUserID.fullName;
					delete item.initiatingUserID.fullName;
				}
			});
			dispatch(
				fetchNotificationsSuccess({
					notifications: data.data,
					lastItemTimestamp: data.lastItemTimestamp || undefined,
					isNoMoreItems: data.isNoMoreItems,
				})
			);
		} catch (error) {
			console.error(error);
			dispatch(fetchNotificationsFail(error as Error));
		}
	};
};

export const readNotification = function (
	token: string,
	notificationID: string
) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`notifications/markAsRead/${notificationID}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			dispatch(setReadNotification({ _id: notificationID }));
		} catch (error) {
			console.error(error);
		}
	};
};

export const readAllNotification = function (token: string) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `notifications/markAsRead`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			dispatch(setReadAllNotification());
		} catch (error) {
			console.error(error);
		}
	};
};
