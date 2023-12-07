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
		<h5 className={classes["no-items-msg"]}>
			No items to suggest at this moment.
		</h5>
	);

	return (
		<div className={classes.suggestions}>
			<Card className={classes["list-container"]}>
				<h3>People you might know</h3>
				<ul>
					{friends?.suggestionItems?.map((item) => (
						<SocialSuggestionItem
							key={item._id}
							suggestionItem={item}
							suggestionType="friend"
							addItem={handleAddSuggestionItem}
						/>
					)) || noItemsMessageEL}
				</ul>
			</Card>
			<Card className={classes["list-container"]}>
				<h3>Top communities</h3>
				<ul>
					{groups?.suggestionItems?.map((item) => (
						<SocialSuggestionItem
							key={item._id}
							suggestionItem={item}
							suggestionType="group"
							addItem={handleAddSuggestionItem}
						/>
					)) || noItemsMessageEL}
				</ul>
			</Card>
			<Card className={classes["list-container"]}>
				<h3>Suggested pages</h3>
				<ul>
					{pages?.suggestionItems?.map((item) => (
						<SocialSuggestionItem
							key={item._id}
							suggestionItem={item}
							suggestionType="page"
							addItem={handleAddSuggestionItem}
						/>
					)) || noItemsMessageEL}
				</ul>
			</Card>
		</div>
	);
};

export default SocialSuggestions;
