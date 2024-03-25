import React from "react";
import classes from "./Logo.module.css";
import appLogo from "./app logo.png";

type Props = {
	imageClassname?: string;
	wrapperClassname?: string;
};

const Logo: React.FC<Props> = function ({ imageClassname, wrapperClassname }) {
	return (
		<div className={`${classes.container} ${wrapperClassname || ""}`}>
			<img
				className={`${classes.logo} ${imageClassname || ""}`}
				src={appLogo}
				alt="Printed circuit board-like nodes tree."
			/>
		</div>
	);
};

export default Logo;
