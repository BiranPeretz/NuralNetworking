import React, { useEffect, useRef } from "react";
import classes from "./Feed.module.css";
import NewPost from "./posts/NewPost";
import Post from "./posts/Post";
import NewSocialInstance from "./NewSocialInstance";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../store/postsThunks";
import type { RootState, AppDispatch } from "../../store/store";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import getToken from "../../util/getToken";
import { FadeLoader } from "react-spinners";

type Props = {
	creatorType: "User" | "Group" | "Page";
	feedType?: "friends" | "groups" | "pages";
};

//Top level feed component, container of posts, there are 4 types of feed
const Feed: React.FC<Props> = function ({ creatorType, feedType }) {
	const scrollRef = useRef<any>();
	const isFetching = useRef(false);
	const hasRun = useRef(false); //For dev env
	const token = getToken(); //JWT token
	const {
		_id: userID,
		fullName: userName,
		profilePicture: userProfilePicture,
	} = useSelector((state: RootState) => state.user);
	const { posts, lastItemTimestamp, isNoMoreItems, isLoading } = useSelector(
		(state: RootState) => state.post
	);
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function

	//run once on mount
	useEffect(() => {
		if (import.meta.env.PROD || !hasRun.current) {
			dispatch(
				//fetch feed posts, save in store
				fetchPosts("user-related", token!, false, undefined, true, feedType)
			);
		}
		hasRun.current = true; //For dev env
	}, []);

	//infinite scrolling logic
	useEffect(() => {
		const simpleBarInstance = scrollRef.current.getScrollElement();
		const threshold = 350;

		const handleScroll = function () {
			if (!isFetching.current) {
				const { scrollTop, scrollHeight, clientHeight } = simpleBarInstance;

				//if bottom treashold reached, fetch more posts
				if (scrollTop + clientHeight >= scrollHeight - threshold) {
					isFetching.current = true;

					dispatch(
						fetchPosts(
							"user-related",
							token!,
							isNoMoreItems,
							lastItemTimestamp,
							false,
							feedType
						)
					)
						.catch((err) =>
							console.error(
								`ERROR fetching infinite scroll next batch: ${err.message}`
							)
						)
						//set 200ms cooldown between executions
						.finally(() => {
							setTimeout(() => {
								isFetching.current = false;
							}, 200);
						});
				}
			}
		};

		// re-add scroll listener
		simpleBarInstance.addEventListener("scroll", handleScroll);
		return () => simpleBarInstance.removeEventListener("scroll", handleScroll);
	}, [scrollRef, lastItemTimestamp]);

	return (
		<SimpleBar
			style={{
				position: "fixed",
				left: "50%",
				top: "5rem",
				bottom: "1.75rem",
				transform: "translateX(-50%)",
				width: "37.5rem",
				maxHeight: "calc(100% - calc(5rem + 1.75rem))",
				overflowX: "hidden",
			}}
			ref={scrollRef}
		>
			<div className={classes.feed}>
				<div className={classes["action-buttons"]}>
					<NewPost
						creatorType={creatorType}
						creator={{
							_id: userID,
							name: userName!,
							profilePicture: userProfilePicture,
						}}
					/>
					{feedType === "groups" && <NewSocialInstance instanceType="group" />}
					{feedType === "pages" && <NewSocialInstance instanceType="page" />}
				</div>
				{posts?.map((post) => {
					return post && <Post post={post} key={post?._id} />;
				})}
				{isLoading && (
					<div className={classes.loader}>
						<FadeLoader
							color="#000000"
							height={10}
							margin={-4}
							radius={2}
							speedMultiplier={2}
							width={5}
						/>
					</div>
				)}
				{isNoMoreItems && (
					<h4 className={classes["no-more-items"]}>No more posts.</h4>
				)}
			</div>
		</SimpleBar>
	);
};

export default Feed;
