import React from "react";
import classes from "./SocialSuggestionItem.module.css";
import socialSuggestionItem from "../../types/socialSuggestionItem";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { removeSuggestion } from "../../store/suggestionsSlice";
import AddItem from "../../assets/icons/AddItem";
import TrashItem from "../../assets/icons/TrashItem";
import SocialItem from "../UI/SocialItem";

type Props = {
	suggestionItem: socialSuggestionItem; //data of suggested item
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

//this util function take's the suggested item data and type and return a formated message that is used as promotion for the user
const generateSuggestionMessage = function (
	suggestionItem: socialSuggestionItem,
	suggestionType: "friend" | "group" | "page"
) {
	if (Number(suggestionItem.mutualCount) > 0) {
		//if there are mutual friends engaged with this item
		const message =
			suggestionType === "friend"
				? `${suggestionItem.mutualCount} mutal friends`
				: `${suggestionItem.mutualCount} friends ${
						suggestionType === "group" ? "participate" : "follow"
				  }`; //output: "X mutal friends" or "X friends participate/follow"

		//if single mutual, remove plural marker
		if (Number(suggestionItem.mutualCount) === 1) {
			return message.replace("friends", "friend");
		} //else
		return message;
	} //else
	return suggestionItem.popularity ? "Popular" : "New";
};

//suggestion item component, includes the item data, suggestion message and actions (add/remove) buttons
const SocialSuggestionItem: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function

	//add item button click handler, pass item's data to parent's add item function
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

	//remove item button click hanlder. currently only updates local store's state
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
			<SocialItem
				pictureSrc={props.suggestionItem.profilePicture}
				name={props.suggestionItem.name!}
				subText={suggestionMSG}
			/>
			<div className={classes.icons}>
				<AddItem className={classes["icon__add"]} onClick={addSuggestionItem} />
				<TrashItem
					className={classes["icon__remove"]}
					onClick={removeSuggestionItem}
				/>
			</div>
		</li>
	);
};

export default SocialSuggestionItem;
