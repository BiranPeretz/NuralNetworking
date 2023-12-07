import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/nav-bar/NavBar";
import LeftSideMenu from "../../components/left-side section/LeftSideMenu";
import RightSideMenu from "../../components/right-side section/RightSideMenu";
import { useProtect } from "../../custom-hooks/useProtect";

const FeedLayout = function () {
	const { isLoading } = useProtect();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Fragment>
			<NavBar />
			<LeftSideMenu />
			<RightSideMenu />
			<Outlet />
		</Fragment>
	);
};

export default FeedLayout;
