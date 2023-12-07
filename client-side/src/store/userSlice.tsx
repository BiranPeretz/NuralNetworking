import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type userType from "../types/user";
import socialItemType from "../types/socialItem";
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
		authenticateUser: function (state, action: PayloadAction<userType>) {
			const { _id, email } = action.payload;
			const token = getToken();
			if (!_id || !token || !email) {
				//Error authenticating the user.
				console.log(
					"Tried to authenticate user but id, token or email was falsy."
				);
				//TODO: Create some custom error handling to display a message to the user and rediret him to login/signup page here or anywhere else
				return state;
			}

			return action.payload;
		},
		createProfile: function (state, action: PayloadAction<userType>) {
			state.fullName = action.payload.fullName;
			state.profilePicture = action.payload.profilePicture;
			state.about = action.payload.about;
		},
		addFriends: function (
			state,
			action: PayloadAction<friendConnectionType[]>
		) {
			state.friendsList = [...action.payload, ...state.friendsList];
		},
		addGroups: function (state, action: PayloadAction<groupConnectionType[]>) {
			state.groupsList = [...action.payload, ...state.groupsList];
		},
		addPages: function (state, action: PayloadAction<pageConnectionType[]>) {
			state.pagesList = [...action.payload, ...state.pagesList];
		},
		addFriendRequests: function (
			state,
			action: PayloadAction<friendRequestType[]>
		) {
			state.friendRequestsList = [
				...action.payload,
				...state.friendRequestsList,
			];
		},
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
