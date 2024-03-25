import classes from "./NavButton.module.css";
import { Link } from "react-router-dom";

const NavButton: React.FC<{
	icon: React.ReactNode;
	to: string;
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
