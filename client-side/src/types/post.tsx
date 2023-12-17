import socialItemType from "./socialItem";
import likeType from "./like";
import commentType from "./comment";

export type postContentType = {
	text: string | null;
	image?: string;
};

//Required properties only (mostly for instance creation)
export type postRequired = {
	content: postContentType | null;
	creatorType: "User" | "Group" | "Page";
	creatorID: string | null;
	author?: string | null;
	image?: File;
};

type postType = {
	_id: string | null;
	content: postContentType | null;
	timestamp?: Date;
	creatorType: "User" | "Group" | "Page" | null;
	creatorID: socialItemType | null;
	author?: socialItemType;
	likeList?: likeType[];
	commentsList: commentType[];
};

export default postType;
