import React, { useRef } from "react";
import classes from "./ContactsSearch.module.css";
import SearchInput from "../UI/SearchInput";
import { useDispatch } from "react-redux";

const ContactsSearch: React.FC = function () {
	const searchClickHandler = function () {
		if (!searchRef?.current?.value) {
			return;
		}
	};
	return (
		<SearchInput
			className={classes["search-input__container"]}
			inputClassName={classes["search-input__input"]}
			inputType="text"
			inputName="local-search"
			placeholder="Search My Socials"
			iconSize="25px"
			onIconClick={searchClickHandler}
			ref={searchRef}
		/>
	);
};

export default ContactsSearch;
