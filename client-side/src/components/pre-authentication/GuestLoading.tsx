import React from "react";
import classes from "./Forms.module.css";
import { PreAuthModalsNames } from "./Welcome";
import { FadeLoader } from "react-spinners";

type Props = {
	changeModal: (
		modalName: PreAuthModalsNames,
		sourceModalName?: PreAuthModalsNames
	) => void;
	originModalName?: PreAuthModalsNames;
};

//Loading modal for guest login due to deployment's slow cold start
const GuestLoading: React.FC<Props> = function (props) {
	return (
		<>
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
			<h4 className={classes["first-login-text"]}>
				First login might take up to a minute.
			</h4>
		</>
	);
};

export default GuestLoading;
