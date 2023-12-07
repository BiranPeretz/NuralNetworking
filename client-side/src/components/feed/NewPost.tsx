import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./NewPost.module.css";
import Card from "../UI/Card";
import Modal from "../UI/Modal";
import NewPostForm from "./NewPostForm";
import socialItemType from "../../types/socialItem";
import { useGroupHosts } from "../../custom-hooks/useGroupHosts";

type Props = {
	creatorType: "User" | "Group" | "Page";
	creatorID: socialItemType;
	children?: React.ReactNode;
};

const NewPost: React.FC<Props> = function (props) {
	const [displayModal, setDisplayModal] = useState(false);

	let hostsArray;

	if (props.creatorType !== "User") {
		if (props.creatorType === "Group") {
			//TODO: there is a problem where if the user did not fetch the groupsList yet (first groups button press) the array would be empty, fix it
			hostsArray = useGroupHosts();
			console.log("hostArr group nested:	", hostsArray);
		} else if (props.creatorType === "Page") {
			// hostsArray = usePageHosts();
			console.log("hostArr page nested:	", hostsArray);
		}
	}

	const displayModalHandler = function () {
		setDisplayModal(true);
	};

	const closeModalHandler = function () {
		setDisplayModal(false);
	};

	console.log("hostArr before return:	", hostsArray);

	return (
		<Fragment>
			<Card className={classes["new-post"]} onClick={displayModalHandler}>
				<h2>Post something...</h2>
			</Card>

			{displayModal &&
				ReactDOM.createPortal(
					<Modal
						className={classes["new-post__modal"]}
						title="Create new post"
						onClose={closeModalHandler}
					>
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
