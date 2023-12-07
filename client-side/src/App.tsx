import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import WelcomePage from "./pages/Welcome";
import ErrorPage from "./pages/Error";
import CreateProfilePage from "./pages/CreateProfile";
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
				path: "login",
				element: <LoginPage />,
			},
			{
				path: "signup",
				element: <SignupPage />,
			},
			{ path: "createProfile", element: <CreateProfilePage /> },
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
