import {
	setIsLoading,
	setError,
	setHadInitialFetch,
	setCategoryState,
	addCategoryStateBatch,
	SearchCategoryType,
} from "./searchSlice";
import { sendFriendRequest, addConnection } from "./userThunks";
import { removeSuggestion } from "./suggestionsSlice";

//fetch search results only for provided(singular) category
export const fetchSearchCategory = function (
	token: string,
	socialType: "user" | "group" | "page",
	searchString: string,
	page: number,
	limit: number,
	isNextBatch?: boolean //boolean value to determine if this is initial request (page 1) or just another batch of results (page >= 2)
) {
	return async function (dispatch: any) {
		try {
			//set category's loading state to true
			dispatch(setIsLoading({ value: true, socialType }));

			//fetch search results
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`${socialType}s/search${
						socialType.charAt(0).toUpperCase() + socialType.slice(1)
					}s?value=${searchString}&page=${page}&limit=${limit}`,
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

			//if requesting next batch of results (page >== 2)
			if (isNextBatch) {
				//append new results to existing ones
				dispatch(
					addCategoryStateBatch({
						value: data.data as SearchCategoryType,
						socialType,
					})
				);
			} else {
				//initial results request (page === 1)
				//set results data as category's results
				dispatch(
					setCategoryState({
						value: data.data as SearchCategoryType,
						socialType,
					})
				);
			}
			//done fetching, set isLoading to false
			dispatch(setIsLoading({ value: false, socialType }));

			dispatch(setHadInitialFetch({ value: true }));
		} catch (error) {
			//if caught an error
			//set isLoading to false
			dispatch(setIsLoading({ value: false, socialType }));

			//if it's an Error instance, extract its message
			if (error instanceof Error) {
				dispatch(setError({ value: error.message, socialType }));
			} else if (typeof error === "string") {
				dispatch(setError({ value: error, socialType }));
			} else {
				//unexpected error type
				dispatch(setError({ value: "Unexpected error", socialType }));
				console.error("Unexpected error type:", error);
			}
		}
	};
};

//this function will request to add search results item to it's user's corresponding list
export const connectWithSearchItem = function (
	token: string,
	socialType: "user" | "group" | "page",
	itemId: string
) {
	return async function (dispatch: any) {
		try {
			let list;
			if (socialType === "user") {
				list = "friendsList";
				//adding friends requires sending a friend request
				await dispatch(sendFriendRequest(token, itemId));
			} else {
				list = (socialType + "sList") as "groupsList" | "pagesList"; //output: "groupsList" or "pagesList"
				await dispatch(addConnection(token, list, itemId)); // add group/page
			}

			//remove added item from suggestions
			dispatch(
				removeSuggestion({
					collectionName: list.slice(0, -4) as "friends" | "groups" | "pages",
					_id: itemId,
					doNotExclude: list === "friendsList",
				})
			);
		} catch (error) {
			console.error(error);
		}
	};
};
