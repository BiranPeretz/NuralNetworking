import classes from "./NavButton.module.css";
import { Link } from "react-router-dom";

//custom button replacment component for the navigation bar feed buttons
const NavButton: React.FC<{
	icon: React.ReactNode;
	to: string; //relative url
	isActive?: boolean;
}> = function (props) {
	return (
		<Link
			className={`${classes["icon-button"]} ${
				props.isActive ? classes.active : ""
			}`}
			to={props.to}
		>
			{props.icon}
		</Link>
	);
};

export default NavButton;
