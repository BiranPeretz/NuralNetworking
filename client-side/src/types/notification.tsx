import userType from "./user";
import postType from "./post";
import commentType from "./comment";

type notificationType = {
	_id: string | null;
	userID: string | userType | null;
	timestamp: Date | null;
	notificationType:
		| "like"
		| "comment"
		| "new friend"
		| "new member"
		| "new follower"
		| null;
	initiatorType: "Post" | "Comment" | "User" | null;
	initiatorID: string | postType | commentType | userType | null;
	isRead: boolean | null;
};

export default notificationType;
