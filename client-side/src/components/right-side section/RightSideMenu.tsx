import React from "react";
import classes from "./RightSideMenu.module.css";
import SocialRequests from "./SocialRequests";
import SocialSuggestions from "./SocialSuggestions";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const RightSideMenu: React.FC = function () {
	return (
		<SimpleBar
			style={{
				position: "fixed",
				top: "10%",
				right: "0px",
				bottom: "3%",
				width: "15%",
				maxHeight: "100%",
			}}
		>
			<div className={classes.menu}>
				<SocialRequests />
				<SocialSuggestions />
			</div>
		</SimpleBar>
	);
};

export default RightSideMenu;
