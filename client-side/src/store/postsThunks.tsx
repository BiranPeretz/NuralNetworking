import {
	clearPostsData,
	fetchPostsStart,
	fetchPostsSuccess,
	createPostsSuccess,
	fetchPostsFail,
	setLikeList,
	addPostComment,
} from "./postsSlice";
import type { postRequired } from "../types/post";
import likeType from "../types/like";

export const fetchPosts = function (
	relativeURL: string, //request's relative URL
	token: string,
	isNoMoreItems: boolean,
	lastItemTimestamp?: string,
	reset?: boolean, //reset postsSlice before execution
	postsBy?: "friends" | "groups" | "pages"
) {
	return async function (dispatch: any) {
		//ignore request if no more items to fetch
		if (isNoMoreItems) {
			return;
		}

		//reset postsSlice data if requested to do so
		if (reset) {
			dispatch(clearPostsData());
		}
		//flag state's status as fetching
		dispatch(fetchPostsStart());

		try {
			//request posts data
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`posts/${relativeURL}${
						lastItemTimestamp ? "?lastItemTimestamp=" + lastItemTimestamp : ""
					}${lastItemTimestamp ? "&" : "?"}${
						postsBy ? "postsBy=" + postsBy : ""
					}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			//for each post, standardize the "fullName" property of users to "name" just like groups and pages have
			data.data.forEach((item: any) => {
				if (item?.creatorID?.fullName) {
					item.creatorID.name = item.creatorID.fullName;
					delete item.creatorID.fullName;
				}
				if (item?.author) {
					item.author.name = item.author?.fullName;
					delete item.author?.fullName;
				}
			});

			//set new posts data to store, flag fetching status as successful
			dispatch(
				fetchPostsSuccess({
					posts: data.data,
					lastItemTimestamp: data.lastItemTimestamp || undefined,
					isNoMoreItems: data.isNoMoreItems,
				})
			);
		} catch (error) {
			console.error(error);
			//flag fetching status as error with recieved error
			dispatch(fetchPostsFail(error as Error));
		}
	};
};

//takes the required data for post creation as parameter and uses it to request new post creation
export const createPost = function (token: string, newPost: postRequired) {
	return async function (dispatch: any) {
		dispatch(fetchPostsStart());

		//initialize formData
		const formData = new FormData();
		formData.append("content[text]", newPost.content?.text || "");
		formData.append("content[image]", newPost.content?.image || "");
		formData.append("creatorType", newPost.creatorType);
		if (newPost.creatorID) {
			formData.append("creatorID", newPost.creatorID);
		}
		if (newPost.author) {
			formData.append("author", newPost.author);
		}
		if (newPost.image) {
			formData.append("image", newPost.image);
		}

		try {
			//request new post creation
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `posts/createPost`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(data?.message);
			}
			//initialize new post object
			const post = data.data.post;
			//for each post, standardize the "fullName" property of users to "name" just like groups and pages have
			if (post?.creatorID?.fullName) {
				post.creatorID.name = post.creatorID.fullName;
				delete post.creatorID.fullName;
			}
			if (post?.author) {
				post.author.name = post.author.fullName;
				delete post.author.fullName;
			}
			//append created post to state's posts array
			dispatch(
				createPostsSuccess({
					post,
				})
			);
		} catch (error) {
			dispatch(fetchPostsFail(error as Error));
			throw error;
		}
	};
};

//this function will request to preform the like and unlike actions of a user to a post or comment
export const likeAndUnlike = function (
	token: string,
	itemID: string,
	action: "like" | "unlike",
	model: "posts" | "comments"
) {
	return async function (dispatch: any) {
		try {
			//request like/unlike
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `${model}/${itemID}/${action}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}
			//if liked/unliked item is a comment, extract the post's comments list array
			const postCommentsSection =
				model === "comments" ? data?.data?.post?.commentsList : undefined;
			//initialize payload object
			const payload = {
				postID: data.data.postID,
				likeList: data.data.likeList as likeType[],
				commentID: data.data.commentID,
				postCommentsSection,
			};
			//if liked/unliked item is a comment, define the payload's comment section property value
			if (model === "comments") {
				payload.postCommentsSection = data?.data?.post?.commentsList;
			}
			dispatch(setLikeList(payload));
		} catch (error) {
			console.error(error);
		}
	};
};

//this function request new comment creation. the new comment's parent could be either a post or another comment
export const createComment = function (
	token: string,
	content: string,
	parentID: string,
	actionType: "createComment" | "createCommentReply" //"createComment" for post parent "createCommentReply" for comment parent
) {
	return async function (dispatch: any) {
		try {
			const isPostComment = actionType === "createComment"; //is comment's parent is a post
			const bodyOBJ: any = { content }; //comment's content object
			bodyOBJ[`${isPostComment ? "postID" : "parentCommentID"}`] = parentID; //initialize an "postID" or an "parentCommentID" property, depends on parent type

			//request comment creation
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `comments/${actionType}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bodyOBJ),
				}
			);
			//parse request's response
			const data = await response.json();
			//evaluate request's response status
			if (!(data?.status === "success")) {
				throw new Error(`client-error:${data.message}`);
			}

			//initialize payload object
			const payload = {
				postID: data.data.post._id,
				commentsList: data.data.post.commentsList,
			};

			//append created comment to parent's comments list
			dispatch(addPostComment(payload));
		} catch (error) {
			console.error(error);
			dispatch(fetchPostsFail(error as Error));
		}
	};
};
