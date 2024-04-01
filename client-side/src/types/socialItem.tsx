//a type that contains only the relevant data of an user, group or page, for social purposes. this instance's data will always contain (some of the) data copied from the appropriate item's model
type socialItemType = {
	_id: string | null; //exact copy of the _id property of the item broader instance's type(user/group/page)
	name: string | null; //name of the instance, if it's an user this would contain the full name property value
	profilePicture?: string;
};

export default socialItemType;
