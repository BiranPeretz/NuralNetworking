import { Outlet } from "react-router-dom";

//layout component for root URL components. implemented to support future refactoring and changes
const RootLayout = function () {
	return <Outlet />;
};

export default RootLayout;
