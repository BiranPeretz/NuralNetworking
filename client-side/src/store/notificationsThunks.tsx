import {
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
		//if no more items to fetch, ignore request
		if (isNoMoreItems) {
			return;
		}
		dispatch(fetchNotificationsStart());

		try {
			//fetch notifications
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//for each notification, standardize the "fullName" property of users to "name" just like groups and pages have
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

			//add fetched notifications to slice's array
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

//this function will request to mark a notification(singular) as read
export const readNotification = function (
	token: string,
	notificationID: string
) {
	return async function (dispatch: any) {
		try {
			//request mark notification as read
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			//set notification to updated one sent on response's data
			dispatch(setReadNotification({ _id: notificationID }));
		} catch (error) {
			console.error(error);
		}
	};
};

//request to mark all user's notifications as read
export const readAllNotification = function (token: string) {
	return async function (dispatch: any) {
		try {
			//request mark all notifications as read
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `notifications/markAsRead`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			//also update read status of all notifications in the store
			dispatch(setReadAllNotification());
		} catch (error) {
			console.error(error);
		}
	};
};
