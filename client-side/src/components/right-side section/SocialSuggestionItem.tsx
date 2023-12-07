import React from "react";
import socialItemType from "../../types/socialItem";
import classes from "./SocialSuggestionItem.module.css";
import { LiaPlusSolid, LiaMinusSolid } from "react-icons/lia";
import socialSuggestionItem from "../../types/socialSuggestionItem";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { removeSuggestion } from "../../store/suggestionsSlice";

type Props = {
	suggestionItem: socialSuggestionItem;
	suggestionType: "friend" | "group" | "page";
	addItem: (
		list: "friendsList" | "groupsList" | "pagesList",
		itemId: string,
		removeSuggestionPayload: {
			collectionName: "friends" | "groups" | "pages";
			_id: string;
			doNotExclude?: boolean;
		}
	) => void;
	children?: React.ReactNode;
};

const generateSuggestionMessage = function (
	suggestionItem: socialSuggestionItem,
	suggestionType: "friend" | "group" | "page"
) {
	if (Number(suggestionItem.mutualCount) > 0) {
		const message =
			suggestionType === "friend"
				? `${suggestionItem.mutualCount} mutal friends`
				: `${suggestionItem.mutualCount} friends ${
						suggestionType === "group" ? "participate" : "follow"
				  }`;

		if (Number(suggestionItem.mutualCount) === 1) {
			return message.replace("friends", "friend");
		}
		return message;
	}
	return suggestionItem.popularity ? "Popular" : "New";
};

const SocialSuggestionItem: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>();

	const addSuggestionItem = function () {
		const list = (props.suggestionType + "sList") as
			| "friendsList"
			| "groupsList"
			| "pagesList";

		const _id = props.suggestionItem._id;
		const doNotExclude = list === "friendsList";
		const collectionName = (props.suggestionType + "s") as
			| "friends"
			| "groups"
			| "pages";
		props.addItem(list, _id!, { collectionName, _id: _id!, doNotExclude });
	};

	const removeSuggestionItem = function () {
		dispatch(
			removeSuggestion({
				collectionName: (props.suggestionType + "s") as
					| "friends"
					| "groups"
					| "pages",
				_id: props.suggestionItem._id!,
			})
		);
	};
	const suggestionMSG = generateSuggestionMessage(
		props.suggestionItem,
		props.suggestionType
	);
	return (
		<li className={classes.item} key={props.suggestionItem._id}>
			<img
				src={
					props.suggestionItem.profilePicture ||
					"https://randomuser.me/api/portraits/thumb/men/76.jpg"
				}
			/>
			<div className={classes["item__details"]}>
				<span className={classes.name}>{props.suggestionItem.name}</span>
				<span className={classes.connected}>{suggestionMSG}</span>
			</div>
			<div className={classes.icons}>
				<div
					className={classes["suggestion-icon"]}
					onClick={removeSuggestionItem}
				>
					<LiaMinusSolid size="18px" color="red" />
				</div>
				<div className={classes["suggestion-icon"]} onClick={addSuggestionItem}>
					<LiaPlusSolid size="18px" />
				</div>
			</div>
		</li>
	);
};

export default SocialSuggestionItem;
