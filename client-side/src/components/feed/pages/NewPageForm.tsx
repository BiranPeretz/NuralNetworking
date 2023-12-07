import React, { Fragment, useState, useRef } from "react";
import classes from "./NewPageForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { pageRequired } from "../../../types/page";
import { createPage } from "../../../store/userThunks";
import getToken from "../../../util/getToken";

type Props = {
	children?: React.ReactNode;
	closeModal: () => void;
};

const NewPageForm: React.FC<Props> = function (props) {
	const { _id } = useSelector((state: RootState) => state.user);
	const token = getToken();
	const dispatch = useDispatch<AppDispatch>();

	const pageNameRef = useRef<HTMLInputElement>(null);
	const profilePictureRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	const onSubmitHandler = function (event: React.FormEvent) {
		event.preventDefault();

		if (
			!pageNameRef?.current?.value?.trim() ||
			!descriptionRef?.current?.value?.trim()
		) {
			return;
		}

		const page: pageRequired = {
			name: pageNameRef!.current!.value,
			profilePicture: profilePictureRef?.current?.value,
			description: descriptionRef!.current!.value,
		};
		dispatch(createPage(token!, page));
		props.closeModal();
	};

	return (
		<form className={classes.form} onSubmit={onSubmitHandler}>
			<label htmlFor="pageName">Page Name</label>
			<input
				type="text"
				name="pageName"
				placeholder="Enter the page name"
				ref={pageNameRef}
			/>
			<label htmlFor="profilePicture">Page Picture (optional)</label>
			<input
				type="text"
				name="profilePicture"
				placeholder="enter picture URL"
				ref={profilePictureRef}
			/>
			<textarea
				name="description"
				className={classes["page__content"]}
				placeholder="Add page description..."
				ref={descriptionRef}
			/>
			<button className={classes.submit} type="submit">
				<h2>Create new page</h2>
			</button>
		</form>
	);
};

export default NewPageForm;
