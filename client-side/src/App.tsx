import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import WelcomePage from "./components/pre-authentication/Welcome";
import ErrorPage from "./pages/Error";
import FeedLayout from "./pages/feed-pages/FeedLayout";
import HomeFeedPage from "./pages/feed-pages/HomeFeed";
import FriendsFeedPage from "./pages/feed-pages/FriendsFeed";
import GroupsFeedPage from "./pages/feed-pages/GroupsFeed";
import PagesFeedPage from "./pages/feed-pages/PagesFeed";
import "simplebar-react/dist/simplebar.min.css";

//react router DOM's router initialization
const router = createBrowserRouter([
	{
		path: "/", //root path
		element: <RootLayout />, //root layout component. applied to all childs
		errorElement: <ErrorPage />, //the error page component
		children: [
			//root's direct childs
			{ index: true, element: <WelcomePage /> }, //the root or "home" page of the application
			{
				path: "feed", //   "/feed"
				element: <FeedLayout />, //feed's root page
				children: [
					{ index: true, element: <HomeFeedPage /> },
					{ path: "friends", element: <FriendsFeedPage /> },
					{ path: "groups", element: <GroupsFeedPage /> },
					{ path: "social-pages", element: <PagesFeedPage /> },
				],
			},
		],
	},
]);

//The App component that sets up the router context for the app.
const App = function () {
	return <RouterProvider router={router} />;
};

export default App;
