import postType from "../types/post";
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
	relativeURL: string,
	token: string,
	isNoMoreItems: boolean,
	lastItemTimestamp?: string,
	reset?: boolean,
	postsBy?: "friends" | "groups" | "pages"
) {
	return async function (dispatch: any) {
		if (isNoMoreItems) {
			return;
		}
		dispatch(fetchPostsStart());

		if (reset) {
			dispatch(clearPostsData());
		}

		try {
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
			const data = await response.json();
			console.log(response);
			console.log(data);
			if (!response.ok) {
				throw new Error(`client-error:${data.message}`);
			}
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
			dispatch(
				fetchPostsSuccess({
					posts: data.data,
					lastItemTimestamp: data.lastItemTimestamp || undefined,
					isNoMoreItems: data.isNoMoreItems,
				})
			);
		} catch (error) {
			console.error(error);
			dispatch(fetchPostsFail(error as Error));
		}
	};
};

export const createPost = function (token: string, newPost: postRequired) {
	return async function (dispatch: any) {
		dispatch(fetchPostsStart());

		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `posts/createPost`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newPost),
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(`client-error:${data.message}`);
			}
			const post = data.data.post;
			if (post?.creatorID?.fullName) {
				post.creatorID.name = post.creatorID.fullName;
				delete post.creatorID.fullName;
			}
			if (post?.author) {
				post.author.name = post.author.fullName;
				delete post.author.fullName;
			}

			dispatch(
				createPostsSuccess({
					post,
				})
			);
		} catch (error) {
			console.error(error);
			dispatch(fetchPostsFail(error as Error));
		}
	};
};

export const likeAndUnlike = function (
	token: string,
	itemID: string,
	action: "like" | "unlike",
	model: "posts" | "comments"
) {
	return async function (dispatch: any) {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER_URL + `${model}/${itemID}/${action}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(`client-error:${data.message}`);
			}
			const payload = {
				postID: data.data.postID,
				likeList: data.data.likeList as likeType[],
				commentID: data.data.commentID,
			};
			dispatch(setLikeList(payload));
		} catch (error) {
			console.error(error);
		}
	};
};

export const newPostComment = function (
	token: string,
	content: string,
	parentID: string,
	actionType: "createComment" | "createCommentReply"
) {
	return async function (dispatch: any) {
		try {
			const isPostComment = actionType === "createComment";
			const bodyOBJ: any = { content };
			bodyOBJ[`${isPostComment ? "postID" : "parentCommentID"}`] = parentID;
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
			const data = await response.json();
			if (!response.ok) {
				throw new Error(`client-error:${data.message}`);
			}

			const payload = {
				postID: data.data.post._id,
				commentsList: data.data.post.commentsList,
			};

			dispatch(addPostComment(payload));
		} catch (error) {
			console.error(error);
			dispatch(fetchPostsFail(error as Error));
		}
	};
};