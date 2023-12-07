import userType from "./user";

//Required properties only (mostly for instance creation)
export type groupRequired = {
	name: string | null;
	profilePicture?: string;
	description: string | null;
};

type groupType = {
	_id: string | null;
	name: string | null;
	profilePicture?: string;
	description: string | null;
	membersList?: userType[];
	admin: userType | null;
};

export default groupType;
