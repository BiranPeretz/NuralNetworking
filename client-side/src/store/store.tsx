import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postsSlice";
import suggestionReducer from "./suggestionsSlice";
import notificationReducer from "./notificationsSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		post: postReducer,
		suggestions: suggestionReducer,
		notifications: notificationReducer,
		search: searchReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
