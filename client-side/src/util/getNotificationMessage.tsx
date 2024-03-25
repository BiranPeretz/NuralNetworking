import notificationType from "../types/notification";
import postType from "../types/post";
import commentType from "../types/comment";
import socialItemType from "../types/socialItem";

const getNotificationMessage = function (notificationItem: notificationType) {
	const { notificationType, initiatorType, initiatorID } = notificationItem;
	let message: string = ``;
	const CONTENT_TRESHOLD: number = 13;

	switch (notificationType) {
		case "like": //initiator type could be "Post" or "Comment"
		case "comment":
			let initiatorContent: string = "";
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
					: initiatorContent;

			message = `${
				notificationType === "like" ? "liked" : "replied to"
			} your ${initiatorType?.toLowerCase()} "${initiatorContent}".`;
			break;

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
