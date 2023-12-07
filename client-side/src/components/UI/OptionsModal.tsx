import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./OptionsModal.module.css";
// import Backdrop from "../UI/Backdrop";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type Props = {
	positionCoords: { x: number; y: number };
	onEmojiSelect: (Emoji: any) => void;
	onClose: () => void;
};

const OptionsModal: React.FC<Props> = function (props) {
	return (
		<Fragment>
			{ReactDOM.createPortal(
				// <Backdrop backdropClick={props.onClose} />
				<div
					className={classes.modal}
					style={{
						left: `${(props.positionCoords.x + 53).toString()}px`,
						top: `${props.positionCoords.y.toString()}px`,
					}}
				>
					<div className={classes.arrow}></div>
					<ul>
						<Picker data={data} onEmojiSelect={props.onEmojiSelect} />
					</ul>
				</div>,
				document.getElementById("root-overlay")!
			)}
		</Fragment>
	);
};

export default OptionsModal;
