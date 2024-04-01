import postType from "./post";
import commentType from "./comment";
import socialItemType from "./socialItem";

//notifications on this app are created automatically for various events triggered by users' actions
type notificationType = {
	_id: string | null; //id of the notification instance
	userID: socialItemType | null; //data of the user that recieve the notification
	timestamp: Date | null;
	notificationType:
		| "like"
		| "comment"
		| "friend request"
		| "new friend"
		| "new member"
		| "new follower"
		| null; //the different events that trigger notification creation
	initiatorType: "Post" | "Comment" | "User" | "Group" | "Page" | null; //the different instance types that the notification if created for
	initiatorID: postType | commentType | socialItemType | null; //has type of initiatorType and holds the initiator data
	initiatingUserID: socialItemType | null; //the user who preformed the action that triggered the notification
	isRead: boolean | null; //recieving user's boolean read/not read status
};

export default notificationType;
