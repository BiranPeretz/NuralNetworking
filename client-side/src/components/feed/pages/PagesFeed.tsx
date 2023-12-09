import React, { useEffect, useRef } from "react";
import classes from "./PagesFeed.module.css";
import NewPage from "./NewPage";
import NewPost from "../NewPost";
import Post from "../Post";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../../store/postsThunks";
import type { RootState, AppDispatch } from "../../../store/store";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import getToken from "../../../util/getToken";
import { FadeLoader } from "react-spinners";

type Props = {
	children?: React.ReactNode;
};

//TODO: combine all feed components to one generic
const PagesFeed: React.FC<Props> = function (props) {
	const scrollRef = useRef<any>();
	const isFetching = useRef(false);
	const hasRun = useRef(false); //For dev env
	const token = getToken();
	const {
		_id: userID,
		fullName: userName,
		profilePicture: userProfilePicture,
	} = useSelector((state: RootState) => state.user);
	const { posts, lastItemTimestamp, isNoMoreItems, isLoading } = useSelector(
		(state: RootState) => state.post
	);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		if (import.meta.env.PROD || !hasRun.current) {
			dispatch(
				fetchPosts("user-related", token!, false, undefined, true, "pages")
			);
		}
		hasRun.current = true; //For dev env
	}, []);

	const handleFetchPosts = function () {
		dispatch(
			fetchPosts(
				"user-related",
				token!,
				isNoMoreItems,
				lastItemTimestamp,
				false,
				"pages"
			)
		);
	};

	useEffect(() => {
		const simpleBarInstance = scrollRef.current.getScrollElement();

		const handleScroll = function () {
			if (!isFetching.current) {
				const { scrollTop, scrollHeight, clientHeight } = simpleBarInstance;

				if (scrollTop + clientHeight >= scrollHeight) {
					console.log("Scrolled to the end!");
					isFetching.current = true;

					console.log(lastItemTimestamp);
					console.log(posts);
					dispatch(
						fetchPosts(
							"user-related",
							token!,
							isNoMoreItems,
							lastItemTimestamp,
							false,
							"pages"
						)
					)
						.catch((err) =>
							console.error(
								`ERROR fetching infinite scroll next batch: ${err.message}`
							)
						)
						.finally(() => {
							// re-add the scroll listener
							setTimeout(() => {
								isFetching.current = false;
							}, 200);
						});
				}
			}
		};

		simpleBarInstance.addEventListener("scroll", handleScroll);
		return () => simpleBarInstance.removeEventListener("scroll", handleScroll);
	}, [scrollRef, lastItemTimestamp]);

	return (
		<SimpleBar
			style={{
				position: "fixed",
				left: "50%",
				top: "10%",
				bottom: "3%",
				transform: "translateX(-50%)",
				width: "600px",
				maxHeight: "87%",
			}}
			ref={scrollRef}
		>
			<div className={classes.feed}>
				<div className={classes["action-buttons"]}>
					<NewPost
						creatorType="Page"
						creatorID={{
							_id: userID,
							name: userName!,
							profilePicture: userProfilePicture,
						}}
					/>
					<NewPage />
				</div>
				{posts?.map((post) => {
					return post && <Post post={post} key={post?._id} />;
				})}
				{!isLoading && !isNoMoreItems && (
					<button onClick={handleFetchPosts}>more</button>
				)}

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
				{isNoMoreItems && <h5>No more posts.</h5>}
			</div>
		</SimpleBar>
	);
};

export default PagesFeed;
