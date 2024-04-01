//the type liking in this app. like is an action that an user could preform on posts or comments
type likeType = {
	user: { _id: string; fullName: string }; //liking user's instance id and hes text name
	timestamp: Date | string;
};

export default likeType;
