import userType from "./user";
import postType from "./post";
import commentType from "./comment";
import socialItemType from "./socialItem";

type notificationType = {
	_id: string | null;
	userID: socialItemType | null;
	timestamp: Date | null;
	notificationType:
		| "like"
		| "comment"
		| "friend request"
		| "new friend"
		| "new member"
		| "new follower"
		| null;
	initiatorType: "Post" | "Comment" | "User" | "Group" | "Page" | null;
	initiatorID: postType | commentType | socialItemType | null;
	initiatingUserID: socialItemType | null;
	isRead: boolean | null;
};

export default notificationType;
