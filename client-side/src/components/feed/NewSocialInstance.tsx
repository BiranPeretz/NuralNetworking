import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./NewSocialInstance.module.css";
import Card from "../UI/Card";
import Modal from "../UI/Modal";
import NewSocialInstanceForm from "./NewSocialInstanceForm";

type Props = {
	instanceType: "group" | "page";
};

//generic create group/page button, displayed for the groups/pages feed
const NewSocialInstance: React.FC<Props> = function ({ instanceType }) {
	const [displayModal, setDisplayModal] = useState(false);

	const displayModalHandler = function () {
		setDisplayModal(true);
	};

	const closeModalHandler = function () {
		setDisplayModal(false);
	};

	return (
		<Fragment>
			<Card className={classes["new-instance"]} onClick={displayModalHandler}>
				<h2
					className={classes["new-instance__text"]}
				>{`Create new ${instanceType}`}</h2>
			</Card>

			{displayModal &&
				ReactDOM.createPortal(
					<Modal
						title={`Create new ${instanceType}`}
						onClose={closeModalHandler}
					>
						<NewSocialInstanceForm
							instanceType={instanceType}
							closeModal={closeModalHandler}
						/>
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default NewSocialInstance;
