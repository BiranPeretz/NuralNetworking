import classes from "./NavButton.module.css";
import { Link } from "react-router-dom";

const NavButton: React.FC<{ icon: React.ReactNode; to: string }> = function (
	props
) {
	return (
		<Link className={classes["icon-button"]} to={props.to}>
			{props.icon}
		</Link>
	);
};

export default NavButton;
