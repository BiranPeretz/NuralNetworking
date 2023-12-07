import React, { useState, useEffect, useRef } from "react";
import classes from "./FilterContacts.module.css";
import type { RootState, AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchSocialList } from "../../store/userThunks";
import getToken from "../../util/getToken";

type Props = {
	setDisplayList: (
		listName: "friendsList" | "groupsList" | "pagesList"
	) => void;
};

type FetchedListsType = {
	friendsList: boolean;
	groupsList: boolean;
	pagesList: boolean;
};

const FilterContacts: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>();
	const token = getToken();
	const [activeButton, setActiveButton] = useState<HTMLElement | null>(null);
	const friendsButtonRef = useRef<HTMLButtonElement | null>(null);
	const hasFechedFriends = useRef(false);
	const [fetchedLists, setFetchedLists] = useState<FetchedListsType>({
		friendsList: true,
		groupsList: false,
		pagesList: false,
	});

	useEffect(() => {
		setActiveButton(friendsButtonRef.current); //set frineds button as active
		if (import.meta.env.PROD || !hasFechedFriends.current) {
			dispatch(fetchSocialList(token!, "friendsList")); //fetch friends once automatically
		}
		hasFechedFriends.current = true; //For dev env
	}, []);

	useEffect(() => {
		//toggle active button class for prev and current buttons clicked
		activeButton?.classList?.add(classes.active);
		return () => {
			activeButton?.classList?.remove(classes.active);
		};
	}, [activeButton]);

	const filterContactsHandler = function (
		listName: string,
		event: React.MouseEvent
	) {
		setActiveButton(event.target as HTMLElement);
		props.setDisplayList(
			listName as "friendsList" | "groupsList" | "pagesList"
		);

		if (fetchedLists[listName as keyof FetchedListsType]) {
			console.log(fetchedLists);
			return;
		}
		dispatch(
			fetchSocialList(
				token!,
				listName as "friendsList" | "groupsList" | "pagesList"
			)
		);

		setFetchedLists((prev) => ({ ...prev, [listName]: true }));
	};

	return (
		<div className={classes["filter-buttons"]}>
			<button
				name="friends"
				onClick={filterContactsHandler.bind(null, "friendsList")}
				ref={friendsButtonRef}
			>
				Friends
			</button>
			<button
				name="groups"
				onClick={filterContactsHandler.bind(null, "groupsList")}
			>
				Groups
			</button>
			<button
				name="pages"
				onClick={filterContactsHandler.bind(null, "pagesList")}
			>
				Pages
			</button>
		</div>
	);
};

export default FilterContacts;
