import React, { Fragment, useState, useRef } from "react";
import ReactDOM from "react-dom";
import classes from "./GlobalSearch.module.css";
import Modal from "../UI/Modal";
import getToken from "../../util/getToken";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import SearchInput from "../UI/SearchInput";
import { clearSearchData, setHadInitialFetch } from "../../store/searchSlice";
import { fetchSearchCategory } from "../../store/searchThunks";
import SearchResults from "./SearchResults";
import { FadeLoader } from "react-spinners";

type Props = {
	children?: React.ReactNode;
};

//top level global search component, return the search input and display the results modal. also fetch initial search results from DB
const GlobalSearch: React.FC<Props> = function (props) {
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const [displayModal, setDisplayModal] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const token = getToken(); //JWT token
	const {
		user: userSearchState,
		group: groupSearchState,
		page: pageSearchState,
		hadInitialFetch,
	} = useSelector((state: RootState) => state.search);

	//the search execution function, handle the store's search state
	const onSearchHandler = function () {
		if (!searchRef?.current?.value) {
			return;
		}

		//reset store's search state data
		dispatch(clearSearchData());

		setDisplayModal(true);

		//initial results fetch from DB
		dispatch(
			fetchSearchCategory(token!, "user", searchRef?.current?.value, 1, 5)
		); //fetch matching users
		dispatch(
			fetchSearchCategory(token!, "group", searchRef?.current?.value, 1, 5)
		); //fetch matching groups
		dispatch(
			fetchSearchCategory(token!, "page", searchRef?.current?.value, 1, 5)
		); //fetch matching pages
	};

	//close search results modal, eventually will also reset store's search state
	const closeModalHandler = function () {
		dispatch(setHadInitialFetch({ value: false }));
		setDisplayModal(false);
	};

	//conditions to display no items message instead of everything else
	const displayNoItemsMessage =
		hadInitialFetch &&
		userSearchState.categoryState.results.length === 0 &&
		groupSearchState.categoryState.results.length === 0 &&
		pageSearchState.categoryState.results.length === 0;

	return (
		<Fragment>
			<SearchInput
				className={classes["nav__search"]}
				inputType="text"
				inputName="global-search"
				placeholder="Search everywhere (using full words)"
				onIconClick={onSearchHandler}
				ref={searchRef}
			/>
			{displayModal &&
				ReactDOM.createPortal(
					<Modal title="Search results" onClose={closeModalHandler}>
						<div className={classes.container}>
							{userSearchState.categoryState.results.length > 0 ? (
								<SearchResults
									socialType="user"
									searchString={searchRef?.current?.value!}
								/>
							) : (
								userSearchState.isLoading && (
									<div className={classes.loader}>
										<FadeLoader
											color="#000000"
											height={10}
											margin={-4}
											radius={2}
											speedMultiplier={2}
											width={5}
										/>
									</div>
								)
							)}

							{groupSearchState.categoryState.results.length > 0 ? (
								<SearchResults
									socialType="group"
									searchString={searchRef?.current?.value!}
								/>
							) : (
								groupSearchState.isLoading && (
									<div className={classes.loader}>
										<FadeLoader
											color="#000000"
											height={10}
											margin={-4}
											radius={2}
											speedMultiplier={2}
											width={5}
										/>
									</div>
								)
							)}

							{pageSearchState.categoryState.results.length > 0 ? (
								<SearchResults
									socialType="page"
									searchString={searchRef?.current?.value!}
								/>
							) : (
								pageSearchState.isLoading && (
									<div className={classes.loader}>
										<FadeLoader
											color="#000000"
											height={10}
											margin={-4}
											radius={2}
											speedMultiplier={2}
											width={5}
										/>
									</div>
								)
							)}

							{displayNoItemsMessage && (
								<h3 className={classes["no-items"]}>
									No matching items, search with full words or try different
									value.
								</h3>
							)}
						</div>
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default GlobalSearch;
