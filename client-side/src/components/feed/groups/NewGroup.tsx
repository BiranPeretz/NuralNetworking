import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./NewGroup.module.css";
import Card from "../../UI/Card";
import Modal from "../../UI/Modal";
import NewGroupForm from "./NewGroupForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

type Props = {
	children?: React.ReactNode;
};

const NewGroup: React.FC<Props> = function (props) {
	const userState = useSelector((state: RootState) => state.user);

	const [displayModal, setDisplayModal] = useState(false);

	const displayModalHandler = function () {
		setDisplayModal(true);
	};

	const closeModalHandler = function () {
		setDisplayModal(false);
	};

	return (
		<Fragment>
			<Card className={classes["new-group"]} onClick={displayModalHandler}>
				<h2>Create new group</h2>
			</Card>

			{displayModal &&
				ReactDOM.createPortal(
					<Modal
						className={classes["new-group__modal"]}
						title="Create new group"
						onClose={closeModalHandler}
					>
						<NewGroupForm closeModal={closeModalHandler} />
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default NewGroup;
