import React, { Fragment, useState } from "react";
import classes from "./SearchResults.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchSearchCategory } from "../../store/searchThunks";

import SearchResultsItem from "./SearchResultsItem";
import Card from "../UI/Card";
import getToken from "../../util/getToken";
import { FadeLoader } from "react-spinners";

type Props = {
	socialType: "user" | "group" | "page";
	searchString: string;
};

const SearchResults: React.FC<Props> = function ({ socialType, searchString }) {
	const dispatch = useDispatch<AppDispatch>();
	const token = getToken();
	const { categoryState, isLoading, error } = useSelector(
		(state: RootState) => state.search[socialType]
	);
	const { isNoMoreItems, page, limit, results } = categoryState;

	const fetchNextBatch = function () {
		if (isNoMoreItems) {
			return;
		}

		dispatch(
			fetchSearchCategory(
				token!,
				socialType,
				searchString,
				page + 1,
				limit,
				true
			)
		);
	};

	return (
		<Card className={classes.container}>
			<div className={classes["top-container"]}>
				<h3 className={classes.header}>
					{socialType.charAt(0).toUpperCase() + socialType.slice(1) + "s"}
				</h3>
				{!isNoMoreItems && (
					<button
						disabled={isLoading}
						className={`${classes["fetch-button"]} ${
							isLoading ? classes.disabled : ""
						}`}
						onClick={fetchNextBatch}
					>
						<h4 className={classes["button-text"]}>More</h4>
					</button>
				)}
			</div>

			{results.length > 0 ? (
				<Fragment>
					<ul>
						{results?.map((item) => (
							<SearchResultsItem
								key={item._id}
								socialType={socialType}
								item={item}
							/>
						))}
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
					</ul>
					{isNoMoreItems && (
						<h3 className={classes["no-more-items-msg"]}>No more results.</h3>
					)}
				</Fragment>
			) : (
				<h4
					className={classes["no-items-msg"]}
				>{`No ${socialType}s found, search with full words or try different words`}</h4>
			)}
		</Card>
	);
};

export default SearchResults;
