import React, { useEffect, useRef } from "react";
import classes from "./SocialSuggestions.module.css";
import Card from "../UI/Card";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchSocialSuggestions } from "../../store/userThunks";
import SocialSuggestionItem from "./SocialSuggestionItem";
import { addSuggestionItem } from "../../store/suggestionsThunks";
import getToken from "../../util/getToken";

type Props = {
	children?: React.ReactNode;
};

//top level component for social suggestions, contains suggestions card for each type (users/groups/pages) with appropriate list and header. also response for data fetch and manipulation
const SocialSuggestions: React.FC<Props> = function (props) {
	const token = getToken(); //JWT token
	const { friends, groups, pages } = useSelector(
		(state: RootState) => state.suggestions
	); // the store's 3 suggestion lists
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const hasRun = useRef<boolean>(false); //for dev env

	//fetch data from DB, execute once per app reload
	useEffect(() => {
		if (import.meta.env.PROD || !hasRun.current) {
			//fetch suggestions for all 3 social types
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

	//this function response for adding a suggestion to the user's appropriate list, handles store's state and DB update
	const handleAddSuggestionItem = function (
		list: "friendsList" | "groupsList" | "pagesList", //name of social list
		itemId: string, //_id of suggestion item
		removeSuggestionPayload: {
			//payload object for store's suggestion slice update
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
