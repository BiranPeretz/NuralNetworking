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

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <WelcomePage /> },
			{
				path: "feed",
				element: <FeedLayout />,
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

const App = function () {
	return <RouterProvider router={router} />;
};

export default App;
