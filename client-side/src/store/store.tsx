import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postsSlice";
import suggestionReducer from "./suggestionsSlice";
import notificationReducer from "./notificationsSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		post: postReducer,
		suggestions: suggestionReducer,
		notifications: notificationReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
