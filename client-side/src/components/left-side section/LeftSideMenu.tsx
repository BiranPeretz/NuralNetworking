import React, { useState } from "react";
import classes from "./LeftSideMenu.module.css";
import ContactsSearch from "./ContactsSearch";
import Contacts from "./Contacts";
import FilterContacts from "./FilterContacts";

const LeftSideMenu: React.FC = function () {
	const [displayList, setDisplayList] = useState<
		"friendsList" | "groupsList" | "pagesList"
	>("friendsList");
	return (
		<div className={classes.menu}>
			{/* <ContactsSearch /> */}
			<FilterContacts setDisplayList={setDisplayList} />
			<Contacts displayList={displayList} />
		</div>
	);
};

export default LeftSideMenu;
