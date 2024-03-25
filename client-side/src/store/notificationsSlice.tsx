import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import notificationType from "../types/notification";

type stateType = {
	notifications: notificationType[];
	isNoMoreItems: boolean;
	lastItemTimestamp?: string;
	isLoading: boolean;
	error: Error | null;
};

const initialState: stateType = {
	notifications: [],
	isNoMoreItems: false,
	isLoading: false,
	error: null,
};

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		clearNotificationsData: function () {
			const newState: stateType = {
				notifications: [],
				isNoMoreItems: false,
				lastItemTimestamp: undefined,
				isLoading: false,
				error: null,
			};
			return newState;
		},
		fetchNotificationsStart: function (state) {
			state.isLoading = true;
			state.error = null;
		},
		fetchNotificationsSuccess: function (
			state,
			action: PayloadAction<{
				notifications: notificationType[];
				isNoMoreItems?: boolean;
				lastItemTimestamp?: string;
			}>
		) {
			state.notifications = state.notifications.concat(
				action.payload.notifications
			);
			state.isNoMoreItems = action.payload.isNoMoreItems || state.isNoMoreItems;
			state.lastItemTimestamp =
				action.payload.lastItemTimestamp || state.lastItemTimestamp;
			state.isLoading = false;
		},

		fetchNotificationsFail: function (state, action: PayloadAction<Error>) {
			state.isLoading = false;
			state.error = action.payload;
		},
		setReadNotification: function (
			state,
			action: PayloadAction<{ _id: string }>
		) {
			state.notifications?.find((item) => {
				if (item._id === action.payload._id) {
					item.isRead = true;
				}
			});
		},
		setReadAllNotification: function (state) {
			if (state.notifications?.length > 0) {
				state.notifications?.forEach((item) => {
					item.isRead = true;
				});
			}
		},
	},
});

export const {
	clearNotificationsData,
	fetchNotificationsStart,
	fetchNotificationsSuccess,
	fetchNotificationsFail,
	setReadNotification,
	setReadAllNotification,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
