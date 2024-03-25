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

//fetch search results for given category
export const fetchSearchCategory = function (
	token: string,
	socialType: "user" | "group" | "page",
	searchString: string,
	page: number,
	limit: number,
	isNextBatch?: boolean
) {
	return async function (dispatch: any) {
		try {
			dispatch(setIsLoading({ value: true, socialType }));

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
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			if (isNextBatch) {
				dispatch(
					addCategoryStateBatch({
						value: data.data as SearchCategoryType,
						socialType,
					})
				);
			} else {
				dispatch(
					setCategoryState({
						value: data.data as SearchCategoryType,
						socialType,
					})
				);
			}
			dispatch(setIsLoading({ value: false, socialType }));
			dispatch(setHadInitialFetch({ value: true }));
		} catch (error) {
			dispatch(setIsLoading({ value: false, socialType }));

			if (error instanceof Error) {
				dispatch(setError({ value: error.message, socialType }));
			} else if (typeof error === "string") {
				dispatch(setError({ value: error, socialType }));
			} else {
				dispatch(setError({ value: "Unexpected error", socialType }));
				console.error("Unexpected error type:", error);
			}
		}
	};
};

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
				list = (socialType + "sList") as "groupsList" | "pagesList";
				await dispatch(addConnection(token, list, itemId));
			}

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
