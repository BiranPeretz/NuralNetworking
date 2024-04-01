import React, { useState } from "react";
import classes from "./LeftSideMenu.module.css";
import Contacts from "./Contacts";
import FilterContacts from "./FilterContacts";

//top level component for the entire left column of the app, containing the contacts of the user and its filtration
const LeftSideMenu: React.FC = function () {
	const [displayList, setDisplayList] = useState<
		"friendsList" | "groupsList" | "pagesList"
	>("friendsList"); //state of the currently displayed contacts list
	return (
		<div className={classes.menu}>
			<FilterContacts setDisplayList={setDisplayList} />
			<Contacts displayList={displayList} />
		</div>
	);
};

export default LeftSideMenu;
