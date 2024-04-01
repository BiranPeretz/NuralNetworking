import notificationType from "../types/notification";
import postType from "../types/post";
import commentType from "../types/comment";
import socialItemType from "../types/socialItem";

//function for generating formated message to display on notification instances, takes notification item asparameter and return the formated message as string
const getNotificationMessage = function (notificationItem: notificationType) {
	const { notificationType, initiatorType, initiatorID } = notificationItem; //extract notification data
	let message: string = ``; //decleration of the returned message
	const CONTENT_TRESHOLD: number = 13; //max treashold length for content displayed in the notification message. content could be the text content of a post or comment

	switch (notificationType) {
		case "like": //initiator type could be "Post" or "Comment"
		case "comment":
			let initiatorContent: string = ""; //the content of the item initiated the notification
			if (initiatorType === "Post") {
				const _ = initiatorID as postType;
				initiatorContent = _.content?.text!;
			} else {
				const _ = initiatorID as commentType;
				initiatorContent = _.content;
			}

			initiatorContent =
				initiatorContent.length > CONTENT_TRESHOLD
					? initiatorContent.substring(0, CONTENT_TRESHOLD - 3) + "..."
					: initiatorContent; //truncating initiator content if passed max content treashold length

			message = `${
				notificationType === "like" ? "liked" : "replied to"
			} your ${initiatorType?.toLowerCase()} "${initiatorContent}".`;
			break; //output: "liked/replied to your post/comment {quote initiator content here}"

		case "friend request":
			message = "sent you a friend request.";
			break;

		case "new friend":
			message = "is now you friend.";
			break;

		case "new member": {
			const initiatorTyped = initiatorID as socialItemType;
			message = `has joined your group ${initiatorTyped.name}.`;
			break;
		}

		case "new follower": {
			const initiatorTyped = initiatorID as socialItemType;
			message = `is now following your page ${initiatorTyped.name}.`;
			break;
		}
	}

	return message;
};

export default getNotificationMessage;
