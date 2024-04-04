import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/nav-bar/NavBar";
import LeftSideMenu from "../../components/left-side section/LeftSideMenu";
import RightSideMenu from "../../components/right-side section/RightSideMenu";
import { useProtect } from "../../custom-hooks/useProtect";
import LoadingPage from "../Loading";

//layout component for the different feed pages.
const FeedLayout = function () {
	const { isLoading } = useProtect(); //get the loading state from the useProtect hook in addition to it's other responsibilities

	if (isLoading) {
		//loading page
		return <LoadingPage />;
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
