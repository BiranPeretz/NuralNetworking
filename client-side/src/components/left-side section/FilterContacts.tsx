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

//filter contacts by the contact type (friends groups or pages), containing a button for each type. also fetch desired data from DB when needed
const FilterContacts: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const token = getToken(); //JWT token
	const [activeButton, setActiveButton] = useState<HTMLElement | null>(null); //currently active button
	const friendsButtonRef = useRef<HTMLButtonElement | null>(null); //friends is the default contact type
	const hasFeched = useRef(false); //boolean had initial fetch state, only used in dev env

	//fetch contacts lists data from DB. executed once on mount
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

	//update classList on active button change
	useEffect(() => {
		//add "active" className to current button
		activeButton?.classList?.add(classes.active);
		return () => {
			//remove "active" className from the same button right before next effect execution
			activeButton?.classList?.remove(classes.active);
		};
	}, [activeButton]);

	//this function handle the states changes when choosing different contacts list to display. takes the contacts list name and the mouse click event as parameters
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
