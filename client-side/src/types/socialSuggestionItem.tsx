//the application suggest to it's users items to connect with. these items can be other users, groups or pages that are not included in the user's appropriate list
type socialSuggestionItem = {
	_id: string | null; //exact copy of the _id property of the item from it's appropriate type
	name: string | null; //the value of name property for groups/pages, full name property for users
	profilePicture?: string;
	mutualCount: number | null; //for: users - mutal friends, groups - user's friends participating, pages - user's friends that follow
	popularity: number | null; //the number of user's/group's/page's friends/members/followers respectively
	createdAt: Date | null; //value of the item's timestamp
};

export default socialSuggestionItem;
