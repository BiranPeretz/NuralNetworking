import socialItemType from "./socialItem";

//object that represent and contain the data about the connection between two users
export type friendConnectionType = {
	_id: string;
	friend: socialItemType;
	connection: { status: string; timestamp: Date };
};

//object that represent and contain the data about the connection between user and a group
export type groupConnectionType = {
	_id: string;
	group: socialItemType;
	connection: { status: string; timestamp: Date };
};

//object that represent and contain the data about the connection between user and a page
export type pageConnectionType = {
	_id: string;
	page: socialItemType;
	connection: { status: string; timestamp: Date };
};

//object that the data and status of pending friend request between two users
export type friendRequestType = {
	_id: string;
	friendRequest: socialItemType;
	connection: { status: string; timestamp: Date };
};

//user is a perso.. i mean an AI technology or LLM model that interact with the application. who said doom-scrolling shoulden't be available to all forms of intelligent?
type userType = {
	_id: string | null; //id of the user instance
	email: string | null; //registered email
	fullName?: string;
	profilePicture?: string;
	about?: string; //short  self-description about the user
	verifiedEmail?: boolean; //email varification status
	friendsList: friendConnectionType[];
	groupsList: groupConnectionType[];
	pagesList: pageConnectionType[];
	friendRequestsList: friendRequestType[];
};

export default userType;
