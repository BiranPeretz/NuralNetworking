import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import socialItemType from "../types/socialItem";

type socialType = "user" | "group" | "page";

//singular socail category state type
export type SearchCategoryType = {
	isNoMoreItems: boolean;
	page: number;
	limit: number;
	results: socialItemType[];
};

const initSearchCategory: SearchCategoryType = {
	isNoMoreItems: false,
	page: 1,
	limit: 5,
	results: [],
};

//all 3 social types global search state type
export type stateType = {
	user: {
		categoryState: SearchCategoryType;
		isLoading: boolean;
		error: string | null;
	};
	group: {
		categoryState: SearchCategoryType;
		isLoading: boolean;
		error: string | null;
	};
	page: {
		categoryState: SearchCategoryType;
		isLoading: boolean;
		error: string | null;
	};
	hadInitialFetch: boolean;
};

const initialState: stateType = {
	user: {
		categoryState: initSearchCategory,
		isLoading: false,
		error: null,
	},
	group: {
		categoryState: initSearchCategory,
		isLoading: false,
		error: null,
	},
	page: {
		categoryState: initSearchCategory,
		isLoading: false,
		error: null,
	},
	hadInitialFetch: false,
};

const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		//reset slice's state data
		clearSearchData: function () {
			const newState: stateType = {
				user: {
					categoryState: {
						isNoMoreItems: false,
						page: 1,
						limit: 5,
						results: [],
					},
					isLoading: false,
					error: null,
				},
				group: {
					categoryState: {
						isNoMoreItems: false,
						page: 1,
						limit: 5,
						results: [],
					},
					isLoading: false,
					error: null,
				},
				page: {
					categoryState: {
						isNoMoreItems: false,
						page: 1,
						limit: 5,
						results: [],
					},
					isLoading: false,
					error: null,
				},
				hadInitialFetch: false,
			};
			return newState;
		},
		//takes value for isLoading and optionally the social type to set, default is to set all 3 social types isLoading to provided value
		setIsLoading: function (
			state,
			action: PayloadAction<{ value: boolean; socialType?: socialType }>
		) {
			const { value, socialType } = action.payload;

			if (socialType) {
				state[socialType].isLoading = value;
			} else {
				state.user.isLoading = value;
				state.group.isLoading = value;
				state.page.isLoading = value;
			}
		},
		setError: function (
			state,
			action: PayloadAction<{ value: string | null; socialType?: socialType }>
		) {
			const { value, socialType } = action.payload;

			if (socialType) {
				state[socialType].error = value;
			} else {
				state.user.error = value;
				state.group.error = value;
				state.page.error = value;
			}
		},
		setHadInitialFetch: function (
			state,
			action: PayloadAction<{ value: boolean }>
		) {
			const { value } = action.payload;

			state.hadInitialFetch = value;
		},
		setCategoryState: function (
			state,
			action: PayloadAction<{
				value: SearchCategoryType;
				socialType: socialType;
			}>
		) {
			const { value, socialType } = action.payload;

			state[socialType].categoryState = value;
		},
		//append next page of search results
		addCategoryStateBatch: function (
			state,
			action: PayloadAction<{
				value: SearchCategoryType;
				socialType: socialType;
			}>
		) {
			const { value, socialType } = action.payload;

			const newCategoryState = value;

			newCategoryState.results = state[socialType].categoryState.results.concat(
				newCategoryState.results
			);

			state[socialType].categoryState = newCategoryState;
		},
		//set the value for one singular category search result
		setCategoryResults: function (
			state,
			action: PayloadAction<{
				value: socialItemType[];
				socialType: socialType;
			}>
		) {
			const { value, socialType } = action.payload;

			state[socialType].categoryState.results = value;
		},
		setCategoryPage: function (
			state,
			action: PayloadAction<{
				value: number;
				socialType: socialType;
			}>
		) {
			const { value, socialType } = action.payload;

			state[socialType].categoryState.page = value;
		},
	},
});

export const {
	clearSearchData,
	setIsLoading,
	setError,
	setHadInitialFetch,
	setCategoryState,
	addCategoryStateBatch,
	setCategoryResults,
	setCategoryPage,
} = searchSlice.actions;
export default searchSlice.reducer;
