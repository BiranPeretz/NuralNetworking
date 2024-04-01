import {
	addConnection,
	fetchSocialSuggestions,
	sendFriendRequest,
} from "./userThunks";
import { removeSuggestion } from "./suggestionsSlice";

//this function will request to add a suggestion item(another user/group/page) to the user's corresponding list.
export const addSuggestionItem = function (
	token: string,
	list: "friendsList" | "groupsList" | "pagesList",
	itemId: string,
	removeSuggestionPayload: {
		collectionName: "friends" | "groups" | "pages";
		_id: string;
		doNotExclude?: boolean;
	},
	excludeArrays: any
) {
	return async function (dispatch: any) {
		try {
			if (list === "friendsList") {
				//adding friends requires sending a friend request
				await dispatch(sendFriendRequest(token, itemId));
			} else {
				// try to add the suggested item and to update the database + store
				await dispatch(addConnection(token, list, itemId));
			}

			// If no errors, remove the suggested item
			dispatch(removeSuggestion(removeSuggestionPayload));
		} catch (error) {
			console.error(error);

			// if any error, fetch suggestions from the server as it sould reset suggestionsSlice to match the database
			dispatch(fetchSocialSuggestions(token, excludeArrays));
		}
	};
};
