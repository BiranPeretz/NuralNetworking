import React from "react";
import classes from "./SearchResultsItem.module.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import socialItemType from "../../types/socialItem";
import SocialItem from "../UI/SocialItem";
import AddItem from "../../assets/icons/AddItem";
import useIsContained from "../../custom-hooks/useIsContained";
import { connectWithSearchItem } from "../../store/searchThunks";
import getToken from "../../util/getToken";

type Props = {
	socialType: "user" | "group" | "page";
	item: socialItemType;
};

const SearchResultsItem: React.FC<Props> = function ({ socialType, item }) {
	const dispatch = useDispatch<AppDispatch>();
	const token = getToken();

	const isContained = useIsContained(socialType, item._id!);
	const addItemHandler = function () {
		dispatch(connectWithSearchItem(token!, socialType, item._id!));
	};

	return (
		<div className={classes.container}>
			<SocialItem pictureSrc={item?.profilePicture} name={item?.name!} />
			{!isContained && (
				<AddItem className={classes["icon__add"]} onClick={addItemHandler} />
			)}
		</div>
	);
};

export default SearchResultsItem;
