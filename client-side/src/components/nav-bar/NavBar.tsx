import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./NavBar.module.css";
import NavButton from "./NavButton";
import RectangleButton from "../UI/RectangleButton";
import useLogout from "../../custom-hooks/useLogout";
import homeFeedIcon from "../../assets/icons/nav-icons/home";
import friendsFeedIcon from "../../assets/icons/nav-icons/friends";
import groupsFeedIcon from "../../assets/icons/nav-icons/groups";
import pagesFeedIcon from "../../assets/icons/nav-icons/pages";
import Logo from "../../assets/Logo";
import ProfilePicture from "../UI/ProfilePicture";
import Notifications from "./notifications/Notifications";
import GlobalSearch from "./GlobalSearch";

//top level navigation bar component, containing app's name and logo, feed by type buttons, global search, notifications, and user's profile picture and logout button
const NavBar: React.FC = function () {
	const location = useLocation();
	const logoutHandler = useLogout();
	const [displayNotifications, setDisplayNotifications] =
		useState<boolean>(false);
	const currentPathname = location.pathname;
	const [displayLogout, setDisplayLogout] = useState<boolean>(false);

	return (
		<nav className={classes.nav}>
			<div className={classes["nav__app-info"]}>
				<NavButton icon={<Logo />} to="/feed"></NavButton>
				<h1 className={classes["app-name"]}>Neural Networking</h1>
			</div>
			<div className={classes["nav__buttons"]}>
				<NavButton
					isActive={currentPathname === "/feed"}
					icon={homeFeedIcon}
					to="/feed"
				></NavButton>
				<NavButton
					isActive={currentPathname === "/feed/friends"}
					icon={friendsFeedIcon()}
					to="/feed/friends"
				></NavButton>
				<NavButton
					isActive={currentPathname === "/feed/groups"}
					icon={groupsFeedIcon()}
					to="/feed/groups"
				></NavButton>
				<NavButton
					isActive={currentPathname === "/feed/social-pages"}
					icon={pagesFeedIcon()}
					to="/feed/social-pages"
				></NavButton>
			</div>
			<div className={classes["nav__right-container"]}>
				<GlobalSearch />
				<div className={classes["nav__user"]}>
					<Notifications
						displayNotifications={displayNotifications}
						setDisplayNotifications={setDisplayNotifications}
					/>
					{displayLogout && (
						<RectangleButton
							name="logout"
							style={{ background: "black", color: "white" }}
							onClick={logoutHandler}
						>
							Logout
						</RectangleButton>
					)}
					<div
						className={classes["profile-picture"]}
						onClick={function () {
							setDisplayLogout((prevState) => !prevState);
						}}
					>
						<ProfilePicture alt="Your profile picture." />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
