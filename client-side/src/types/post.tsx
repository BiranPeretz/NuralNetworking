import socialItemType from "./socialItem";
import likeType from "./like";
import commentType from "./comment";

//the content of a post type
export type postContentType = {
	text: string | null;
	image?: string;
};

//required properties only (mostly for instance creation)
export type postRequired = {
	content: postContentType | null;
	creatorType: "User" | "Group" | "Page";
	creatorID: string | null;
	author?: string | null;
	image?: File;
};

//posts are the main way of users to create content for the app and engage with it. posts are always made by users and could be published on a group, page or the user's owned posts
type postType = {
	_id: string | null; //id of the post instance
	content: postContentType | null; //object containing an required text property (body of the post) and onptional image to display with the text
	timestamp?: Date;
	creatorType: "User" | "Group" | "Page" | null; //the type of the instance created the post
	creatorID: socialItemType | null; //the data of the item there the post is published on (user/group/page)
	author?: socialItemType; //OPTIONAL, data of the user created the post. always defined for group/page owned posts
	likeList?: likeType[]; //list of like instances
	commentsList: commentType[]; //list of (top level only, not nested) comment instances
};

export default postType;
