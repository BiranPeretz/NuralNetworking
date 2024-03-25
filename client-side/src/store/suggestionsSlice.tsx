import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type socialItemType from "../types/socialItem";
import type socialSuggestionItem from "../types/socialSuggestionItem";

export type socialSuggestionsCollectionType = {
	numOfResults: number;
	lastItemIndex: number;
	suggestionItems: socialSuggestionItem[];
	removedSuggestions: unknown[];
};

type stateType = {
	friends: socialSuggestionsCollectionType | null;
	groups: socialSuggestionsCollectionType | null;
	pages: socialSuggestionsCollectionType | null;
	isLoading: boolean;
};

const initialState: stateType = {
	friends: null,
	groups: null,
	pages: null,
	isLoading: false,
};
const suggestionsSlice = createSlice({
	name: "suggestions",
	initialState,
	reducers: {
		setIsLoading: function (state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
		setAllLists: function (
			state,
			action: PayloadAction<{
				friends: socialSuggestionsCollectionType;
				groups: socialSuggestionsCollectionType;
				pages: socialSuggestionsCollectionType;
			}>
		) {
			const newState: stateType = { ...action.payload, isLoading: false };
			return newState;
		},
		setList: function (
			state,
			action: PayloadAction<{
				collectionName: "friends" | "groups" | "pages";
				collection: socialSuggestionsCollectionType;
			}>
		) {
			state[action.payload.collectionName] = action.payload.collection;
		},
		removeSuggestion: function (
			state,
			action: PayloadAction<{
				collectionName: "friends" | "groups" | "pages";
				_id: string;
				doNotExclude?: boolean;
			}>
		) {
			if (!action.payload.doNotExclude) {
				if (
					state[action.payload.collectionName]?.removedSuggestions.some(
						(item) => item === action.payload._id
					) === false
				) {
					state[action.payload.collectionName]?.removedSuggestions.unshift(
						action.payload._id
					);
				}
			}

			if (
				state[action.payload.collectionName]?.suggestionItems?.some(
					(item) => item._id === action.payload._id
				) === true
			) {
				state[action.payload.collectionName]!.suggestionItems = state[
					action.payload.collectionName
				]?.suggestionItems.filter((item) => item._id !== action.payload._id)!;

				state[action.payload.collectionName]!.lastItemIndex =
					state[action.payload.collectionName]!.lastItemIndex - 1;

				state[action.payload.collectionName]!.numOfResults =
					state[action.payload.collectionName]!.numOfResults - 1;
			}
		},
		clearSuggestionsData: function () {
			const newState: stateType = {
				friends: null,
				groups: null,
				pages: null,
				isLoading: false,
			};
			return newState;
		},
	},
});

export const {
	setIsLoading,
	setAllLists,
	setList,
	removeSuggestion,
	clearSuggestionsData,
} = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
