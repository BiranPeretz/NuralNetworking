import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./EmojiPicker.module.css";
import coordinatesType from "../../types/coordinates";
import RoboEmoji from "../../assets/icons/RoboEmoji";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type Props = {
	displayEmojiPicker: boolean;
	setDisplayEmojiPicker: (display: boolean) => void;
	addEmojiHandler: (emoji: any) => void;
};

const EmojiPicker: React.FC<Props> = function ({
	displayEmojiPicker,
	setDisplayEmojiPicker,
	addEmojiHandler,
}) {
	const [modalCoords, setModalCoords] = useState<coordinatesType>({
		x: 0,
		y: 0,
	});

	const hideEmojiPicker = function () {
		setDisplayEmojiPicker(false);
	};

	const showEmojiPicker = function (event: React.MouseEvent<SVGSVGElement>) {
		const iconClicked = (event.target as SVGSVGElement).getBoundingClientRect();
		const centerX = iconClicked.left + iconClicked.width / 2;
		const centerY = iconClicked.top + iconClicked.height / 2;

		setModalCoords({ x: centerX, y: centerY });
		setDisplayEmojiPicker(true);
	};

	return (
		<Fragment>
			<RoboEmoji
				className={classes.icon}
				onClick={displayEmojiPicker ? hideEmojiPicker : showEmojiPicker}
			/>
			{displayEmojiPicker &&
				ReactDOM.createPortal(
					<div
						className={classes.modal}
						style={{
							left: `${(modalCoords.x + 50).toString()}px`,
							top: `${modalCoords.y.toString()}px`,
						}}
					>
						<div className={classes.arrow}></div>
						<Picker data={data} onEmojiSelect={addEmojiHandler} />
					</div>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default EmojiPicker;
