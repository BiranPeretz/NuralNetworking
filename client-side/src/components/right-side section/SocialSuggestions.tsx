import React, { useEffect, useRef } from "react";
import classes from "./SocialSuggestions.module.css";
import Card from "../UI/Card";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchSocialSuggestions } from "../../store/userThunks";
import socialItemType from "../../types/socialItem";
import SocialSuggestionItem from "./SocialSuggestionItem";
import { addSuggestionItem } from "../../store/suggestionsThunks";
import getToken from "../../util/getToken";

type Props = {
	children?: React.ReactNode;
};

const SocialSuggestions: React.FC<Props> = function (props) {
	const token = getToken();
	const { friends, groups, pages } = useSelector(
		(state: RootState) => state.suggestions
	);
	const dispatch = useDispatch<AppDispatch>();
	const hasRun = useRef<boolean>(false);
	useEffect(() => {
		if (import.meta.env.PROD || !hasRun.current) {
			dispatch(
				fetchSocialSuggestions(token!, {
					friends: friends?.removedSuggestions || [],
					groups: groups?.removedSuggestions || [],
					pages: pages?.removedSuggestions || [],
				})
			);
		}
		hasRun.current = true; //For dev env
	}, []);

	const handleAddSuggestionItem = function (
		list: "friendsList" | "groupsList" | "pagesList",
		itemId: string,
		removeSuggestionPayload: {
			collectionName: "friends" | "groups" | "pages";
			_id: string;
			doNotExclude?: boolean;
		}
	) {
		dispatch(
			addSuggestionItem(token!, list, itemId, removeSuggestionPayload, {
				friends: friends?.removedSuggestions || [],
				groups: groups?.removedSuggestions || [],
				pages: pages?.removedSuggestions || [],
			})
		);
	};

	const noItemsMessageEL = (
		<h4 className={classes["no-items-msg"]}>
			No items to suggest at this moment.
		</h4>
	);

	return (
		<div className={classes.suggestions}>
			<Card className={classes["list-container"]}>
				<h3 className={classes["list-header"]}>People you might know</h3>
				{friends?.numOfResults ? (
					<ul>
						{friends?.suggestionItems?.map((item) => (
							<SocialSuggestionItem
								key={item._id}
								suggestionItem={item}
								suggestionType="friend"
								addItem={handleAddSuggestionItem}
							/>
						))}
					</ul>
				) : (
					<h4 className={classes["no-items-msg"]}>No people to suggest.</h4>
				)}
			</Card>
			<Card className={classes["list-container"]}>
				<h3 className={classes["list-header"]}>Top communities</h3>
				{groups?.numOfResults ? (
					<ul>
						{groups?.suggestionItems?.map((item) => (
							<SocialSuggestionItem
								key={item._id}
								suggestionItem={item}
								suggestionType="group"
								addItem={handleAddSuggestionItem}
							/>
						))}
					</ul>
				) : (
					<h4 className={classes["no-items-msg"]}>
						No communities to suggest.
					</h4>
				)}
			</Card>
			<Card className={classes["list-container"]}>
				<h3 className={classes["list-header"]}>Top pages</h3>

				{pages?.numOfResults ? (
					<ul>
						{pages?.suggestionItems?.map((item) => (
							<SocialSuggestionItem
								key={item._id}
								suggestionItem={item}
								suggestionType="page"
								addItem={handleAddSuggestionItem}
							/>
						))}
					</ul>
				) : (
					<h4 className={classes["no-items-msg"]}>No pages to suggest.</h4>
				)}
			</Card>
		</div>
	);
};

export default SocialSuggestions;
