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
	creatorID: socialItemType;
};

const NewPost: React.FC<Props> = function (props) {
	const [displayModal, setDisplayModal] = useState(false);

	let hostsArray;

	if (props.creatorType !== "User") {
		if (props.creatorType === "Group") {
			hostsArray = useGroupHosts();
		} else if (props.creatorType === "Page") {
			hostsArray = usePageHosts();
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
							creatorID={props.creatorID}
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
