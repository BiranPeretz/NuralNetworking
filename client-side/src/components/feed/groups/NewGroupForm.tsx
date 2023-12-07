import React, { Fragment, useState, useRef } from "react";
import classes from "./NewGroupForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { groupRequired } from "../../../types/group";
import { createGroup } from "../../../store/userThunks";
import getToken from "../../../util/getToken";

type Props = {
	children?: React.ReactNode;
	closeModal: () => void;
};

const NewPostForm: React.FC<Props> = function (props) {
	const { _id } = useSelector((state: RootState) => state.user);
	const token = getToken();
	const dispatch = useDispatch<AppDispatch>();

	const groupNameRef = useRef<HTMLInputElement>(null);
	const profilePictureRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	const onSubmitHandler = function (event: React.FormEvent) {
		event.preventDefault();

		if (
			!groupNameRef?.current?.value?.trim() ||
			!descriptionRef?.current?.value?.trim()
		) {
			return;
		}

		const group: groupRequired = {
			name: groupNameRef!.current!.value,
			profilePicture: profilePictureRef?.current?.value,
			description: descriptionRef!.current!.value,
		};
		dispatch(createGroup(token!, group));
		props.closeModal();
	};

	return (
		<form className={classes.form} onSubmit={onSubmitHandler}>
			<label htmlFor="groupName">Group Name</label>
			<input
				type="text"
				name="groupName"
				placeholder="Enter the group name"
				ref={groupNameRef}
			/>
			<label htmlFor="profilePicture">Group Picture (optional)</label>
			<input
				type="text"
				name="profilePicture"
				placeholder="enter picture URL"
				ref={profilePictureRef}
			/>
			<textarea
				name="description"
				className={classes["group__content"]}
				placeholder="Add group description..."
				ref={descriptionRef}
			/>
			<button className={classes.submit} type="submit">
				<h2>Create new group</h2>
			</button>
		</form>
	);
};

export default NewPostForm;
