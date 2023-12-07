import likeType from "./like";
import socialItemType from "./socialItem";

type commentType = {
	_id: string;
	postID: string;
	userID: socialItemType;
	content: string;
	timestamp: Date | string;
	parentCommentID?: commentType;
	childCommentIDs?: commentType[];
	likeList: likeType[] | null;
};

export default commentType;
