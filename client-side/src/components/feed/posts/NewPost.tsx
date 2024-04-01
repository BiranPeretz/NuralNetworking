import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./NewPost.module.css";
import Card from "../../UI/Card";
import Modal from "../../UI/Modal";
import NewPostForm from "./NewPostForm";
import socialItemType from "../../../types/socialItem";
import { useGroupHosts } from "../../../custom-hooks/useGroupHosts";
import { usePageHosts } from "../../../custom-hooks/usePageHosts";
import ProfilePicture from "../../UI/ProfilePicture";

type Props = {
	creatorType: "User" | "Group" | "Page";
	creator: socialItemType;
};
//create new post button component of the feed
const NewPost: React.FC<Props> = function (props) {
	const [displayModal, setDisplayModal] = useState(false);

	let hostsArray; //array of available hosts. host = where the post is posted. host is either group or page

	if (props.creatorType !== "User") {
		if (props.creatorType === "Group") {
			hostsArray = useGroupHosts(); //groups the user participate in
		} else if (props.creatorType === "Page") {
			hostsArray = usePageHosts(); //pages owned by the user
		}
	}

	const displayModalHandler = function () {
		setDisplayModal(true);
	};

	const closeModalHandler = function () {
		setDisplayModal(false);
	};

	return (
		<Fragment>
			<Card
				className={classes["new-post__button"]}
				onClick={displayModalHandler}
			>
				<ProfilePicture className={classes["new-post__picture"]} />
				<h2 className={classes["new-post__text"]}>Post something</h2>
			</Card>

			{displayModal &&
				ReactDOM.createPortal(
					<Modal title="Create new post" onClose={closeModalHandler}>
						<NewPostForm
							creatorType={props.creatorType}
							creator={props.creator}
							closeModal={closeModalHandler}
							hostsArray={hostsArray}
						/>
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default NewPost;
