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
		//TODO: delete or correct functions below
		// createPostsSuccess: function (
		// 	state,
		// 	action: PayloadAction<{
		// 		post: postType;
		// 	}>
		// ) {
		// 	state.posts.unshift(action.payload.post);
		// 	state.isLoading = false;
		// },
		// setLikeList: function (
		// 	state,
		// 	action: PayloadAction<{
		// 		postID: string;
		// 		likeList: likeType[];
		// 		commentID?: string;
		// 	}>
		// ) {
		// 	state.posts.find((post) => {
		// 		if (post._id === action.payload.postID) {
		// 			if (action.payload.commentID) {
		// 				post.commentsList.find((comment) => {
		// 					if (comment._id === action.payload.commentID) {
		// 						comment.likeList = action.payload.likeList || [];
		// 					}
		// 				});
		// 			} else {
		// 				post.likeList = action.payload.likeList || [];
		// 			}
		// 		}
		// 	});
		// },
		// addPostComment: function (
		// 	state,
		// 	action: PayloadAction<{ postID: string; commentsList: commentType[] }>
		// ) {
		// 	state.posts.find((post) => {
		// 		if (post._id === action.payload.postID) {
		// 			post.commentsList = action.payload.commentsList;
		// 		}
		// 	});
		// },
	},
});

export const {
	clearNotificationsData,
	fetchNotificationsStart,
	fetchNotificationsSuccess,
	fetchNotificationsFail,
	// createPostsSuccess,
	// setLikeList,
	// addPostComment,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
