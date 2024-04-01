import likeType from "./like";
import socialItemType from "./socialItem";

//the type for comments in this application. users has the ability to comment on a post or on another comment
type commentType = {
	_id: string; //id of the comment instance
	postID: string; //id of the post the top level comment was posted on
	userID: socialItemType; //data of the user who made the comment
	content: string; //the text content of the comment
	timestamp: Date | string;
	parentCommentID?: commentType; //if direct parent is another comment and not a post
	childCommentIDs?: commentType[]; //array of child comments
	likeList: likeType[] | null;
};

export default commentType;
