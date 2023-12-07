import React, { useRef, Fragment, useState } from "react";
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

type Props = { displayList: "friendsList" | "groupsList" | "pagesList" };

const Contacts: React.FC<Props> = function (props) {
	const userSlice = useSelector((state: RootState) => state.user);
	const searchRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<number | null>(null);
	const [list, setList] = useState<
		(friendConnectionType | groupConnectionType | pageConnectionType)[] | null
	>(null);

	const socialType: "friend" | "group" | "page" = props.displayList.slice(
		0,
		-5
	) as "friend" | "group" | "page";

	const searchChangeHandler = function () {
		if (timerRef?.current) {
			clearTimeout(timerRef.current);
		}

		if (searchRef?.current?.value) {
			timerRef.current = setTimeout(() => {
				console.log(searchRef?.current?.value);
				if (Array.isArray(userSlice[props.displayList])) {
					setList(
						userSlice[props.displayList].filter((item: any) =>
							item[socialType]?.name
								?.toLowerCase()
								.includes(searchRef?.current?.value)
						)
					);
				}
			}, 800);
		} else {
			setList(userSlice[props.displayList]);
		}
	};

	return (
		<Fragment>
			<SearchInput
				className={classes["search-input__container"]}
				inputClassName={classes["search-input__input"]}
				inputType="text"
				inputName="local-search"
				placeholder="Search My Socials"
				iconSize="25px"
				onInputChange={searchChangeHandler}
				// onIconClick={searchClickHandler}  //TODO: add immidiate search execution on click?
				ref={searchRef}
			/>
			<div className={classes.contacts}>
				<ul className={classes["contacts__list"]}>
					{(list || userSlice[props.displayList]).map((item) => (
						<ContactItem
							key={item?._id}
							socialItem={item}
							socialType={socialType}
						/>
					))}
				</ul>
			</div>
		</Fragment>
	);
};

export default Contacts;
