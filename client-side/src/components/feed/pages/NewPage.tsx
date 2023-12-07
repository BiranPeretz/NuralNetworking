import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./NewPage.module.css";
import Card from "../../UI/Card";
import Modal from "../../UI/Modal";
import NewPageForm from "./NewPageForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

type Props = {
	children?: React.ReactNode;
};

const NewPage: React.FC<Props> = function (props) {
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
			<Card className={classes["new-page"]} onClick={displayModalHandler}>
				<h2>Create new page</h2>
			</Card>

			{displayModal &&
				ReactDOM.createPortal(
					<Modal
						className={classes["new-page__modal"]}
						title="Create new page"
						onClose={closeModalHandler}
					>
						<NewPageForm closeModal={closeModalHandler} />
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default NewPage;
