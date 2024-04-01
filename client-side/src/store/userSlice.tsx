import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type userType from "../types/user";
import {
	friendConnectionType,
	groupConnectionType,
	pageConnectionType,
	friendRequestType,
} from "../types/user";
import getToken from "../util/getToken";

const initialState: userType = {
	_id: null,
	email: null,
	friendsList: [],
	groupsList: [],
	pagesList: [],
	friendRequestsList: [],
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		//takes an user as parameter and set it's data as the current state
		authenticateUser: function (state, action: PayloadAction<userType>) {
			const { _id, email } = action.payload;
			const token = getToken(); //JWT token
			if (!_id || !token || !email) {
				return state;
			}

			return action.payload;
		},
		//takes an user as parameter and set it's profile related data as current state
		createProfile: function (state, action: PayloadAction<userType>) {
			state.fullName = action.payload.fullName;
			state.profilePicture = action.payload.profilePicture;
			state.about = action.payload.about;
			state.verifiedEmail = action.payload.verifiedEmail;
		},
		//takes a friend connection object and add it to user's friends list
		addFriends: function (
			state,
			action: PayloadAction<friendConnectionType[]>
		) {
			state.friendsList = [...action.payload, ...state.friendsList];
		},
		//takes a group connection object and add it to user's groups list
		addGroups: function (state, action: PayloadAction<groupConnectionType[]>) {
			state.groupsList = [...action.payload, ...state.groupsList];
		},
		//takes a page connection object and add it to user's pages list
		addPages: function (state, action: PayloadAction<pageConnectionType[]>) {
			state.pagesList = [...action.payload, ...state.pagesList];
		},
		//takes friend request object as parameter and add it to user's frined requests list
		addFriendRequests: function (
			state,
			action: PayloadAction<friendRequestType[]>
		) {
			state.friendRequestsList = [
				...action.payload,
				...state.friendRequestsList,
			];
		},
		//takes name string of a list and array of any of the lists items and set state's list according to those parameters
		setSocialList: function (
			state,
			action: PayloadAction<{
				listName:
					| "friendsList"
					| "groupsList"
					| "pagesList"
					| "friendRequestsList";
				items:
					| friendConnectionType[]
					| groupConnectionType[]
					| pageConnectionType[]
					| friendRequestType[];
			}>
		) {
			switch (action.payload.listName) {
				case "friendsList":
					state.friendsList =
						(action.payload.items as friendConnectionType[]) || [];
					break;
				case "groupsList":
					state.groupsList =
						(action.payload.items as groupConnectionType[]) || [];
					break;
				case "pagesList":
					state.pagesList =
						(action.payload.items as pageConnectionType[]) || [];
					break;
				case "friendRequestsList":
					state.friendRequestsList =
						(action.payload.items as friendRequestType[]) || [];
					break;
				default:
					throw new Error(
						`client-error: invalid value for listName (${action.payload.listName})`
					);
			}
		},
		//takes name string of a list and an item ID to remove matching item
		removeSocialItem: function (
			state,
			action: PayloadAction<{
				listName:
					| "friendsList"
					| "groupsList"
					| "pagesList"
					| "friendRequestsList";
				itemId: string;
			}>
		) {
			const itemId = action.payload.itemId;

			const listName = action.payload.listName;
			let newList: any = state[`${listName}`];

			newList = newList?.filter(
				(item: any) => item[listName?.slice(0, -5)]?.toString() !== itemId
			);

			state[`${listName}`] = newList;
		},
		//reset slice's state data
		clearUserData: function () {
			const newState: userType = {
				_id: null,
				email: null,
				friendsList: [],
				groupsList: [],
				pagesList: [],
				friendRequestsList: [],
			};

			return newState;
		},
	},
});

export const {
	authenticateUser,
	createProfile,
	addFriends,
	addGroups,
	addPages,
	addFriendRequests,
	setSocialList,
	removeSocialItem,
	clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
