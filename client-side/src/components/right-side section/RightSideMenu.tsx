import React from "react";
import classes from "./RightSideMenu.module.css";
import SocialRequests from "./SocialRequests";
import SocialSuggestions from "./SocialSuggestions";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const RightSideMenu: React.FC = function () {
	return (
		<div className={classes.menu}>
			<SimpleBar
				style={{
					height: "calc(100% - 0.5rem)",
					paddingRight: "0.5rem",
					paddingLeft: "0.25rem",
				}}
			>
				<SocialRequests />
				<SocialSuggestions />
			</SimpleBar>
		</div>
	);
};

export default RightSideMenu;
