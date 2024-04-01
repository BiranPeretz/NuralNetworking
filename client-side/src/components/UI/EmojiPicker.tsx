import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./EmojiPicker.module.css";
import coordinatesType from "../../types/coordinates";
import RoboEmoji from "../../assets/icons/RoboEmoji";
import Picker from "@emoji-mart/react"; //emoji picker component
import data from "@emoji-mart/data"; //picker's data attribute value

type Props = {
	displayEmojiPicker: boolean; //boolean display/hide state for the modal
	setDisplayEmojiPicker: (display: boolean) => void; //parent's displayEmojiPicker state setter function
	addEmojiHandler: (emoji: any) => void; //parent's handler function to add emojies
};

//custom component for adding emojies to some text in this application. this component use emoji-mart's UI and functionality to display available emojies. this component return an icon that display/hide the picking modal on click. lib's components are wraped with that Modal component that has been modified to display an arrow pointing to calling element via it's coordinations and css manipulation. the
const EmojiPicker: React.FC<Props> = function ({
	displayEmojiPicker,
	setDisplayEmojiPicker,
	addEmojiHandler,
}) {
	const [modalCoords, setModalCoords] = useState<coordinatesType>({
		x: 0,
		y: 0,
	}); // x,y coodrinates to position the modal and it's pointing arrow

	const hideEmojiPicker = function () {
		setDisplayEmojiPicker(false);
	};

	//this function both display the emojy picker and extract the triggering element center coordinations
	const showEmojiPicker = function (event: React.MouseEvent<SVGSVGElement>) {
		const iconClicked = (event.target as SVGSVGElement).getBoundingClientRect(); //get specific triggering icon element data on runtime
		const centerX = iconClicked.left + iconClicked.width / 2; //get element's X-axis center value
		const centerY = iconClicked.top + iconClicked.height / 2; //get element's Y-axis center value

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
