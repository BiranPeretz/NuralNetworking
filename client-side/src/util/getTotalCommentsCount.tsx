import commentType from "../types/comment";

//recursive function to count the total amount of comments of given comments array, including nested comments replies
const getTotalCommentsCount = (commentsArr: commentType[]): number => {
	return commentsArr.reduce((counter, comment) => {
		const childTotalComments = comment.childCommentIDs
			? getTotalCommentsCount(comment.childCommentIDs)
			: 0;
		return counter + 1 + childTotalComments;
	}, 0);
};

export default getTotalCommentsCount;
