import userType from "./user";

//Required properties only (mostly for instance creation)
export type pageRequired = {
	name: string | null;
	profilePicture?: string;
	description: string | null;
};

type pageType = {
	_id: string | null;
	name: string | null;
	profilePicture?: string;
	description: string | null;
	followersList?: userType[];
	owner: userType | null;
};

export default pageType;
