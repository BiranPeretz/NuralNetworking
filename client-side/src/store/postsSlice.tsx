import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type postType from "../types/post";
import likeType from "../types/like";
import commentType from "../types/comment";

type stateType = {
	posts: postType[];
	isNoMoreItems: boolean;
	lastItemTimestamp?: string;
	isLoading: boolean;
	error: Error | null;
};

const initialState: stateType = {
	posts: [],
	isNoMoreItems: false,
	isLoading: false,
	error: null,
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		//reset slice's state data
		clearPostsData: function () {
			const newState: stateType = {
				posts: [],
				isNoMoreItems: false,
				lastItemTimestamp: undefined,
				isLoading: false,
				error: null,
			};
			return newState;
		},
		//mark state as fetching posts
		fetchPostsStart: function (state) {
			state.isLoading = true;
			state.error = null;
		},
		//for successful post fetching request results, set response data as current state and append new posts to old posts
		fetchPostsSuccess: function (
			state,
			action: PayloadAction<{
				posts: postType[];
				isNoMoreItems?: boolean;
				lastItemTimestamp?: string;
			}>
		) {
			state.posts = state.posts.concat(action.payload.posts);
			state.isNoMoreItems = action.payload.isNoMoreItems || state.isNoMoreItems;
			state.lastItemTimestamp =
				action.payload.lastItemTimestamp || state.lastItemTimestamp;
			state.isLoading = false;
		},
		//for successful post creating request, reset error and isLoading state and append new post to posts array
		createPostsSuccess: function (
			state,
			action: PayloadAction<{
				post: postType;
			}>
		) {
			state.posts.unshift(action.payload.post);
			state.isLoading = false;
			state.error = null;
		},
		fetchPostsFail: function (state, action: PayloadAction<Error>) {
			state.isLoading = false;
			state.error = action.payload;
		},
		//set the like list of a post or comment to new value (mainly used to preform user like and unlike)
		setLikeList: function (
			state,
			action: PayloadAction<{
				postID: string;
				likeList: likeType[];
				commentID?: string;
				postCommentsSection?: commentType[];
			}>
		) {
			state.posts.find((post) => {
				if (post._id === action.payload.postID) {
					if (action.payload.postCommentsSection) {
						post.commentsList = action.payload.postCommentsSection;
					}
					if (action.payload.commentID) {
						post.commentsList.find((comment) => {
							if (comment._id === action.payload.commentID) {
								comment.likeList = action.payload.likeList || [];
							}
						});
					} else {
						post.likeList = action.payload.likeList || [];
					}
				}
			});
		},
		//takes ID of post and array of comments and set the array as new comments list for the post that match the ID
		addPostComment: function (
			state,
			action: PayloadAction<{ postID: string; commentsList: commentType[] }>
		) {
			state.posts.find((post) => {
				if (post._id === action.payload.postID) {
					post.commentsList = action.payload.commentsList;
				}
			});
		},
	},
});

export const {
	clearPostsData,
	fetchPostsStart,
	fetchPostsSuccess,
	createPostsSuccess,
	fetchPostsFail,
	setLikeList,
	addPostComment,
} = postsSlice.actions;
export default postsSlice.reducer;
