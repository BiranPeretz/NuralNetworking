import userType from "./user";

//Required properties only (mostly for instance creation)
export type pageRequired = {
	name: string | null;
	profilePicture?: string;
	description: string | null;
};

//the type for a page instance in this app. a page is created and owned by a single user. other users can follow the page to get access for the page's content. posting content on a pages is restricted for page owner only
type pageType = {
	_id: string | null; //id of the page insstance
	name: string | null;
	profilePicture?: string; //page's picture
	description: string | null; //text that describe the page
	followersList?: userType[]; //list of following users instances
	owner: userType | null; //user instance of the creator who also own this page
};

export default pageType;
