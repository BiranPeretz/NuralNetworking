//home/discover | friends | groups | pages

import { TiPuzzleOutline } from "react-icons/ti";
import { BiHome } from "react-icons/bi";
import { LiaUserFriendsSolid, LiaUsersSolid } from "react-icons/lia";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import classes from "./NavBar.module.css";
import NavButton from "./NavButton";
import buttonStyles from "./NavButton.module.css";
import RectangleButton from "../UI/RectangleButton";
import useLogout from "../../custom-hooks/useLogout";

const NavBar: React.FC = function () {
	const logoutHandler = useLogout();

	return (
		<nav className={classes.nav}>
			<div className={classes["nav__search"]}>
				<NavButton icon={<TiPuzzleOutline />} to="/feed"></NavButton>
				{/* TODO: change with acctual logo */}
				<input
					type="text"
					name="global-search"
					placeholder=" Search anything..."
				/>
			</div>
			<div className={classes["nav__buttons"]}>
				<NavButton icon={<BiHome />} to="/feed"></NavButton>
				<NavButton
					icon={<LiaUserFriendsSolid />}
					to="/feed/friends"
				></NavButton>
				<NavButton icon={<LiaUsersSolid />} to="/feed/groups"></NavButton>
				<NavButton icon={<RiPagesLine />} to="/feed/social-pages"></NavButton>
			</div>
			<div className={classes["nav__user"]}>
				<MdOutlineNotificationsActive className={buttonStyles["icon-button"]} />
				<RectangleButton name="logout" onClick={logoutHandler}>
					Logout
				</RectangleButton>
			</div>
		</nav>
	);
};

export default NavBar;
