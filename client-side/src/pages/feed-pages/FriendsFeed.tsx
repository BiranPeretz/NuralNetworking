// import FriendsFeed from "../../components/feed/friends/FriendsFeed";
import Feed from "../../components/feed/Feed";

const FriendsFeedPage = function () {
	// return <FriendsFeed />;
	return <Feed creatorType="User" feedType="friends" />;
};

export default FriendsFeedPage;
