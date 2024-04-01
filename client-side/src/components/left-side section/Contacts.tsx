import React, { useRef, useEffect, useState } from "react";
import classes from "./Contacts.module.css";
import ContactItem from "./ContactItem";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import SearchInput from "../UI/SearchInput";
import {
	friendConnectionType,
	groupConnectionType,
	pageConnectionType,
} from "../../types/user";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

type Props = { displayList: "friendsList" | "groupsList" | "pagesList" }; //ccurrent contacts displayed list

//contacts list container component. containing the name of the current list, the contact items list and search input that filters contact items by name
const Contacts: React.FC<Props> = function (props) {
	const userSlice = useSelector((state: RootState) => state.user);
	const searchRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<number | null>(null); //automatic search execution timer
	const [list, setList] = useState<
		(friendConnectionType | groupConnectionType | pageConnectionType)[] | null
	>(null); //the filtered list of displayed contacts

	//executes searching function on list change
	useEffect(() => {
		searchChangeHandler();
	}, [props.displayList]);

	const contactType: "friend" | "group" | "page" = props.displayList.slice(
		0,
		-5
	) as "friend" | "group" | "page";

	//search input value change handler function
	const searchChangeHandler = function () {
		if (timerRef?.current) {
			//if timer is initiated
			clearTimeout(timerRef.current); //reset timer
		}

		if (searchRef?.current?.value) {
			timerRef.current = setTimeout(() => {
				//executes when timer reach 0
				if (Array.isArray(userSlice[props.displayList])) {
					//set filter displayed list by name via search string
					setList(
						userSlice[props.displayList].filter((item: any) =>
							item[contactType]?.name
								?.toLowerCase()
								.includes(searchRef?.current?.value)
						)
					);
				}
			}, 500);
		} else {
			setList(null);
		}
	};

	return (
		<div className={classes.container}>
			<SearchInput
				className={classes.search}
				inputType="text"
				inputName="local-search"
				placeholder="Search my socials"
				onInputChange={searchChangeHandler}
				ref={searchRef}
			/>
			<div className={classes.contacts}>
				<h2 className={classes["contacts__type"]}>
					{("my " + (contactType || "CONTACT") + "s").toUpperCase()}
				</h2>
				{(list && list?.length > 0) ||
				userSlice[props.displayList].length > 0 ? (
					<SimpleBar style={{ maxHeight: "calc(100% - 1.5rem)" }}>
						<ul className={classes["contacts__list"]}>
							{(list || userSlice[props.displayList]).map((item) => (
								<ContactItem
									key={item?._id}
									contactItem={item}
									contactType={contactType}
								/>
							))}
						</ul>
					</SimpleBar>
				) : (
					<h4
						className={classes["no-contacts"]}
					>{`No ${contactType}s yet.`}</h4>
				)}
			</div>
		</div>
	);
};

export default Contacts;
