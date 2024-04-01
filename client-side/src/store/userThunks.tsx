import {
	addFriends,
	addGroups,
	addPages,
	setSocialList,
	removeSocialItem,
	authenticateUser,
} from "../store/userSlice";
import { setIsLoading, setAllLists } from "../store/suggestionsSlice";
import { groupRequired } from "../types/group";
import { pageRequired } from "../types/page";
import userType, {
	friendConnectionType,
	friendRequestType,
	groupConnectionType,
	pageConnectionType,
} from "../types/user";
import socialItemType from "../types/socialItem";

//this thunk is preformed after authentication when the user is moved to the Feed. this function will fetch the user related data like name, profile picture and anything defined in the userSlice beside lists data. the functio will set retrieved data as userSlice's state data
export const getMyData = function (token: string) {
	return async function (dispatch: any) {
		try {
			//fetch user related data
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

			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//initialize payload object
			const user = data?.data?.user as userType;
			user.friendsList = [];
			user.groupsList = [];
			user.pagesList = [];
			user.friendRequestsList = [];

			//set results data as current state
			dispatch(authenticateUser(user));
		} catch (error) {
			console.error(error);
		}
	};
};

//this function takes the required data to create a new group as an object as will request to create a new group
export const createGroup = function (token: string, newGroup: groupRequired) {
	return async function (dispatch: any) {
		//initialize formData
		const formData = new FormData();
		formData.append("name", newGroup.name!);
		formData.append("description", newGroup.description!);
		if (newGroup.profilePicture) {
			formData.append("image", newGroup.profilePicture);
		}

		try {
			//request new group creation
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(data?.message);
			}
			//extract social item data from response's data
			const { _id, name, profilePicture } = data?.data?.group;
			//initialize the new group object
			const group: socialItemType = { _id, name, profilePicture };
			//initialize the new group connection payload
			const connectionItem: groupConnectionType =
				data?.data?.user?.groupsList?.filter(
					(item: any) => item.group === data?.data?.group?._id
				)[0];
			connectionItem.group = group;

			//add the new group to the user's group list
			dispatch(addGroups([connectionItem]));
		} catch (error) {
			throw error;
		}
	};
};

//this function takes the required data to create a new page as an object as will request to create a new page
export const createPage = function (token: string, newPage: pageRequired) {
	return async function (dispatch: any) {
		//initialize formData
		const formData = new FormData();
		formData.append("name", newPage.name!);
		formData.append("description", newPage.description!);
		if (newPage.profilePicture) {
			formData.append("image", newPage.profilePicture);
		}

		try {
			//request new page creation
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(data?.message);
			}

			//extract social item data from response's data
			const { _id, name, profilePicture } = data.data.page;
			//initialize the new page object
			const page: socialItemType = { _id, name, profilePicture };
			//initialize the new page connection payload
			const connectionItem: pageConnectionType =
				data.data.user.pagesList.filter(
					(item: any) => item.page === data.data.page._id
				)[0];
			connectionItem.page = page;

			//add the new page to the user's page list
			dispatch(addPages([connectionItem]));
		} catch (error) {
			throw error;
		}
	};
};

//takes one of the four user's lists string name and fetches its data. optional searchString could be passed to this function to only include results that contain the search string in the item's name
export const fetchSocialList = function (
	token: string,
	listName: "friendsList" | "groupsList" | "pagesList" | "friendRequestsList",
	searchString?: string
) {
	return async function (dispatch: any) {
		try {
			//fetch desired list data
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//set request's results data as the new value for correspoding list
			dispatch(setSocialList({ listName, items: data.data }));
		} catch (error) {
			console.error(error);
		}
	};
};

//this function will fetch the user's social suggestions and the extra data needed for the ranking algorithem to work
export const fetchSocialSuggestions = function (
	token: string,
	excludeArrays: any
) {
	return async function (dispatch: any) {
		//set loading state to true
		dispatch(setIsLoading(true));
		try {
			//fetch suggestions data
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//initialize suggestions payload object
			const payload = {
				friends: data?.data?.friends,
				groups: data?.data?.groups,
				pages: data?.data?.pages,
			};

			//set response's data as suggestions on the suggestionsSlice
			dispatch(setAllLists(payload));
		} catch (error) {
			console.error(error);
		}
	};
};

//this function will request to add a new social item(user/group/page) to the user's corresponding list
export const addConnection = function (
	token: string,
	list: "friendsList" | "groupsList" | "pagesList",
	itemId: string
) {
	return async function (dispatch: any) {
		try {
			//request to add item
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//if the item is a new friend
			if (list === "friendsList") {
				//extract friend data
				const { _id, fullName: name, profilePicture } = data.data.sourceItem;
				//initialize friend's social item data
				const friend: socialItemType = { _id, name, profilePicture };
				//initialize payload object
				const connectionItem: friendConnectionType =
					data.data.user.friendsList.filter(
						(item: any) => item.friend === data.data.sourceItem._id
					)[0];
				connectionItem.friend = friend;
				//add friend in state's corresponding list
				dispatch(addFriends([connectionItem]));
			} else if (list === "groupsList") {
				//extract group data
				const { _id, name, profilePicture } = data.data.sourceItem;
				//initialize group's social item data
				const group: socialItemType = { _id, name, profilePicture };
				//initialize payload object
				const connectionItem: groupConnectionType =
					data.data.user.groupsList.filter(
						(item: any) => item.group === data.data.sourceItem._id
					)[0];
				connectionItem.group = group;
				//add group in state's corresponding list
				dispatch(addGroups([connectionItem]));
			} else if (list === "pagesList") {
				//extract page data
				const { _id, name, profilePicture } = data.data.sourceItem;
				//initialize page's social item data
				const page: socialItemType = { _id, name, profilePicture };
				//initialize payload object
				const connectionItem: pageConnectionType =
					data.data.user.pagesList.filter(
						(item: any) => item.page === data.data.sourceItem._id
					)[0];
				connectionItem.page = page;
				//add page in state's corresponding list
				dispatch(addPages([connectionItem]));
			} else {
				throw new Error(`client-error: invalid value for list (${list})`);
			}
		} catch (error) {
			console.error(error);
		}
	};
};

//takes list string name and ID of an item in that list then request to remove this item from the list
export const removeListItem = function (
	token: string,
	list: "friendsList" | "groupsList" | "pagesList" | "friendRequestsList",
	itemId: string
) {
	return async function (dispatch: any) {
		try {
			//request item removal
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
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//if removal was successful remove item from store's state
			dispatch(removeSocialItem({ listName: list, itemId }));
		} catch (error) {
			console.error(error);
		}
	};
};

//this function will send a new friend request on behalf of the user to another user
export const sendFriendRequest = function (token: string, itemId: string) {
	return async function (dispatch: any) {
		try {
			//send new friend request
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/sendFriendRequest/${itemId}`,
				{
					method: "PATCH",
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
			//add the pending friend request to store's state
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

//takes ID of an friend request and reject it
export const rejectFriendRequest = function (token: string, itemId: string) {
	return async function (dispatch: any) {
		try {
			//request to reject friend request
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/rejectFriendRequest/${itemId}`,
				{
					method: "PATCH",
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

			//update friend requests list in store's state
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

//this function will request to accept user's friend request and to add the user as friend
export const acceptFriendRequest = function (token: string, itemId: string) {
	return async function (dispatch: any) {
		try {
			//request accepting friend request
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `users/acceptFriendRequest/${itemId}`,
				{
					method: "PATCH",
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

			//add the new friend to user's friends list
			dispatch(
				setSocialList({
					listName: "friendsList",
					items: data.data.updatedFriendsList as friendConnectionType[],
				})
			);
			//remove friend request from user's friend requests list
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
