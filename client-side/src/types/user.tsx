import socialItemType from "./socialItem";

export type friendConnectionType = {
	_id: string;
	friend: socialItemType;
	connection: { status: string; timestamp: Date };
};

export type groupConnectionType = {
	_id: string;
	group: socialItemType;
	connection: { status: string; timestamp: Date };
};

export type pageConnectionType = {
	_id: string;
	page: socialItemType;
	connection: { status: string; timestamp: Date };
};

export type friendRequestType = {
	_id: string;
	friendRequest: socialItemType;
	connection: { status: string; timestamp: Date };
};

type userType = {
	_id: string | null;
	email: string | null;
	fullName?: string;
	profilePicture?: string;
	about?: string;
	verifiedEmail?: boolean;
	friendsList: friendConnectionType[];
	groupsList: groupConnectionType[];
	pagesList: pageConnectionType[];
	friendRequestsList: friendRequestType[];
};

export default userType;
