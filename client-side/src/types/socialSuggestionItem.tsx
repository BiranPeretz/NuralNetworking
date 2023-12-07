type socialSuggestionItem = {
	_id: string | null;
	name: string | null;
	profilePicture?: string;
	mutualCount: number | null;
	popularity: number | null;
	createdAt: Date | null;
};

export default socialSuggestionItem;
