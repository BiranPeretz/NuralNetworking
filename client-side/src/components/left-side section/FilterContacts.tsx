import React, { useState, useEffect, useRef } from "react";
import classes from "./FilterContacts.module.css";
import type { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { fetchSocialList } from "../../store/userThunks";
import getToken from "../../util/getToken";
import friendsFeedIcon from "../../assets/icons/nav-icons/friends";
import groupsFeedIcon from "../../assets/icons/nav-icons/groups";
import pagesFeedIcon from "../../assets/icons/nav-icons/pages";

type Props = {
	setDisplayList: (
		listName: "friendsList" | "groupsList" | "pagesList"
	) => void;
};

const FilterContacts: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>();
	const token = getToken();
	const [activeButton, setActiveButton] = useState<HTMLElement | null>(null);
	const friendsButtonRef = useRef<HTMLButtonElement | null>(null);
	const hasFeched = useRef(false);

	useEffect(() => {
		setActiveButton(friendsButtonRef.current); //set frineds button as active
		if (import.meta.env.PROD || !hasFeched.current) {
			//fetch all social lists data once
			dispatch(fetchSocialList(token!, "friendsList"));
			dispatch(fetchSocialList(token!, "groupsList"));
			dispatch(fetchSocialList(token!, "pagesList"));
		}
		hasFeched.current = true; //For dev env
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
		setActiveButton(event.currentTarget as HTMLElement);
		props.setDisplayList(
			listName as "friendsList" | "groupsList" | "pagesList"
		);
	};

	return (
		<div className={classes["filter-buttons"]}>
			<button
				className=""
				name="friends"
				onClick={filterContactsHandler.bind(null, "friendsList")}
				ref={friendsButtonRef}
			>
				{friendsFeedIcon(0.66)}
				<h4 className={classes["filter-type"]}>Friends</h4>
			</button>
			<button
				name="groups"
				onClick={filterContactsHandler.bind(null, "groupsList")}
			>
				{groupsFeedIcon(0.66)}
				<h4 className={classes["filter-type"]}>Groups</h4>
			</button>
			<button
				name="pages"
				onClick={filterContactsHandler.bind(null, "pagesList")}
			>
				{pagesFeedIcon(0.66)}
				<h4 className={classes["filter-type"]}>Pages</h4>
			</button>
		</div>
	);
};

export default FilterContacts;
