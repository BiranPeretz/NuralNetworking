import Feed from "../../components/feed/Feed";

//uses the Feed component to create the friends feed page.
const FriendsFeedPage = function () {
	return <Feed creatorType="User" feedType="friends" />;
};

export default FriendsFeedPage;
