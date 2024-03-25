import {
	addFriends,
	addGroups,
	addPages,
	addFriendRequests,
	setSocialList,
	removeSocialItem,
	authenticateUser,
} from "../store/userSlice";
import { setIsLoading, setAllLists } from "../store/suggestionsSlice";
import groupType, { groupRequired } from "../types/group";
import pageType, { pageRequired } from "../types/page";
import { socialSuggestionsCollectionType } from "../store/suggestionsSlice";
import userType, {
	friendConnectionType,
	friendRequestType,
	groupConnectionType,
	pageConnectionType,
} from "../types/user";
import socialItemType from "../types/socialItem";

export const getMyData = function (token: string) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/me`,
				{
					method: "get",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			const user = data?.data?.user as userType;
			user.friendsList = [];
			user.groupsList = [];
			user.pagesList = [];
			user.friendRequestsList = [];

			dispatch(authenticateUser(user));
		} catch (error) {
			console.error(error);
		}
	};
};

export const createGroup = function (token: string, newGroup: groupRequired) {
	return async function (dispatch: any) {
		const formData = new FormData();

		formData.append("name", newGroup.name!);
		formData.append("description", newGroup.description!);
		if (newGroup.profilePicture) {
			formData.append("image", newGroup.profilePicture);
		}

		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `groups/createGroup`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(data?.message);
			}
			const { _id, name, profilePicture } = data?.data?.group;
			const group: socialItemType = { _id, name, profilePicture };
			const connectionItem: groupConnectionType =
				data?.data?.user?.groupsList?.filter(
					(item: any) => item.group === data?.data?.group?._id
				)[0];
			connectionItem.group = group;

			dispatch(addGroups([connectionItem]));
		} catch (error) {
			throw error;
		}
	};
};

export const createPage = function (token: string, newPage: pageRequired) {
	return async function (dispatch: any) {
		const formData = new FormData();

		formData.append("name", newPage.name!);
		formData.append("description", newPage.description!);
		if (newPage.profilePicture) {
			formData.append("image", newPage.profilePicture);
		}

		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `pages/createPage`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(data?.message);
			}

			const { _id, name, profilePicture } = data.data.page;
			const page: socialItemType = { _id, name, profilePicture };
			const connectionItem: pageConnectionType =
				data.data.user.pagesList.filter(
					(item: any) => item.page === data.data.page._id
				)[0];
			connectionItem.page = page;

			dispatch(addPages([connectionItem]));
		} catch (error) {
			throw error;
		}
	};
};

export const fetchSocialList = function (
	token: string,
	listName: "friendsList" | "groupsList" | "pagesList" | "friendRequestsList",
	searchString?: string
) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`users/socialsList?listName=${listName}${
						searchString ? `&searchString=${searchString}` : ""
					}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			console.log(data);
			dispatch(setSocialList({ listName, items: data.data }));
		} catch (error) {
			console.error(error);
		}
	};
};

export const fetchSocialSuggestions = function (
	token: string,
	excludeArrays: any
) {
	return async function (dispatch: any) {
		dispatch(setIsLoading(true));
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/mySuggestions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ excludeArrays }),
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			console.log(data);

			const payload = {
				friends: data?.data?.friends,
				groups: data?.data?.groups,
				pages: data?.data?.pages,
			};
			dispatch(setAllLists(payload));
		} catch (error) {
			console.error(error);
		}
	};
};

export const addConnection = function (
	token: string,
	list: "friendsList" | "groupsList" | "pagesList",
	itemId: string
) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/addListItem`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ list, itemId }),
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			if (list === "friendsList") {
				const { _id, fullName: name, profilePicture } = data.data.sourceItem;
				const friend: socialItemType = { _id, name, profilePicture };
				const connectionItem: friendConnectionType =
					data.data.user.friendsList.filter(
						(item: any) => item.friend === data.data.sourceItem._id
					)[0];
				connectionItem.friend = friend;
				dispatch(addFriends([connectionItem]));
			} else if (list === "groupsList") {
				const { _id, name, profilePicture } = data.data.sourceItem;
				const group: socialItemType = { _id, name, profilePicture };
				const connectionItem: groupConnectionType =
					data.data.user.groupsList.filter(
						(item: any) => item.group === data.data.sourceItem._id
					)[0];
				connectionItem.group = group;
				dispatch(addGroups([connectionItem]));
			} else if (list === "pagesList") {
				const { _id, name, profilePicture } = data.data.sourceItem;
				const page: socialItemType = { _id, name, profilePicture };
				const connectionItem: pageConnectionType =
					data.data.user.pagesList.filter(
						(item: any) => item.page === data.data.sourceItem._id
					)[0];
				connectionItem.page = page;
				dispatch(addPages([connectionItem]));
			} else {
				throw new Error(`client-error: invalid value for list (${list})`);
			}
		} catch (error) {
			console.error(error);
		}
	};
};

//Remove social list item
export const removeListItem = function (
	token: string,
	list: "friendsList" | "groupsList" | "pagesList" | "friendRequestsList",
	itemId: string
) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/removeListItem`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ list, itemId }),
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			dispatch(removeSocialItem({ listName: list, itemId }));
		} catch (error) {
			console.error(error);
		}
	};
};

//Send friend request
export const sendFriendRequest = function (token: string, itemId: string) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/sendFriendRequest/${itemId}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			dispatch(
				setSocialList({
					listName: "friendRequestsList",
					items: data.data.updatedFriendRequestsList as friendRequestType[],
				})
			);
		} catch (error) {
			console.error(error);
		}
	};
};

//Reject friend request
export const rejectFriendRequest = function (token: string, itemId: string) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/rejectFriendRequest/${itemId}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			dispatch(
				setSocialList({
					listName: "friendRequestsList",
					items: data.data.updatedFriendRequestsList as friendRequestType[],
				})
			);
		} catch (error) {
			console.error(error);
		}
	};
};

//Accept friend request
export const acceptFriendRequest = function (token: string, itemId: string) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/acceptFriendRequest/${itemId}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			dispatch(
				setSocialList({
					listName: "friendsList",
					items: data.data.updatedFriendsList as friendConnectionType[],
				})
			);
			dispatch(
				setSocialList({
					listName: "friendRequestsList",
					items: data.data.updatedFriendRequestsList as friendRequestType[],
				})
			);
		} catch (error) {
			console.error(error);
		}
	};
};
