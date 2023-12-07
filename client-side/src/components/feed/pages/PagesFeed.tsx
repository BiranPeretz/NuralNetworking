import React, { useEffect, useRef } from "react";
import classes from "./PagesFeed.module.css";
import NewPage from "./NewPage";
import Post from "../Post";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../../store/postsThunks";
import { clearPostsData } from "../../../store/postsSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import getToken from "../../../util/getToken";

type Props = {
	children?: React.ReactNode;
};

//TODO: combine all feed components to one generic
const PagesFeed: React.FC<Props> = function (props) {
	const scrollRef = useRef<any>();
	const isFetching = useRef(false);
	const hasRun = useRef(false); //For dev env
	const token = getToken();
	const { posts, lastItemTimestamp, isNoMoreItems, isLoading, error } =
		useSelector((state: RootState) => state.post);
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

	const handleClearPosts = function () {
		dispatch(clearPostsData());
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
					// Fetch more data from your server here
					dispatch(
						fetchPosts("user-related", token!, isNoMoreItems, lastItemTimestamp)
					)
						.catch((err) =>
							console.error(
								`ERROR fetching infinite scroll next batch: ${err.message}`
							)
						)
						.finally(() => {
							// Re-add the scroll listener after the desired cooldown
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
				<NewPage />
				{posts?.map((post) => {
					return post && <Post post={post} key={post?._id} />;
				})}
				{!isLoading && !isNoMoreItems && (
					<button onClick={handleFetchPosts}>more</button>
				)}
				{!isLoading && <button onClick={handleClearPosts}>clear</button>}
				{isLoading && <h5>Loading...</h5>}
				{isNoMoreItems && <h5>No more posts.</h5>}
			</div>
		</SimpleBar>
	);
};

export default PagesFeed;
