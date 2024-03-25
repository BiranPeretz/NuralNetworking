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

type Props = { displayList: "friendsList" | "groupsList" | "pagesList" };

const Contacts: React.FC<Props> = function (props) {
	const userSlice = useSelector((state: RootState) => state.user);
	const searchRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<number | null>(null);
	const [list, setList] = useState<
		(friendConnectionType | groupConnectionType | pageConnectionType)[] | null
	>(null);

	useEffect(() => {
		searchChangeHandler();
	}, [props.displayList]);

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
				if (Array.isArray(userSlice[props.displayList])) {
					setList(
						userSlice[props.displayList].filter((item: any) =>
							item[socialType]?.name
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
					{("my " + (socialType || "CONTACT") + "s").toUpperCase()}
				</h2>
				{(list && list?.length > 0) ||
				userSlice[props.displayList].length > 0 ? (
					<SimpleBar style={{ maxHeight: "calc(100% - 1.5rem)" }}>
						<ul className={classes["contacts__list"]}>
							{(list || userSlice[props.displayList]).map((item) => (
								<ContactItem
									key={item?._id}
									socialItem={item}
									socialType={socialType}
								/>
							))}
						</ul>
					</SimpleBar>
				) : (
					<h4 className={classes["no-contacts"]}>{`No ${socialType}s yet.`}</h4>
				)}
			</div>
		</div>
	);
};

export default Contacts;
