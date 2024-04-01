import userType from "./user";

//Required properties only (mostly for instance creation)
export type groupRequired = {
	name: string | null;
	profilePicture?: string;
	description: string | null;
};

//the type for a group instance in this app. a group is created by individual user (group's admin). other users can join and then post on the group for members to see
type groupType = {
	_id: string | null; //id of the group instance
	name: string | null;
	profilePicture?: string; //group's picture
	description: string | null; //text that describe the group
	membersList?: userType[]; //list of user instances who joined the group
	admin: userType | null; //also the group creator
};

export default groupType;
