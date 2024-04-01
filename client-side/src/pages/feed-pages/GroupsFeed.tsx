import Feed from "../../components/feed/Feed";

//uses the Feed component to create the groups feed page.
const GroupsFeedPage = function () {
	return <Feed creatorType="Group" feedType="groups" />;
};

export default GroupsFeedPage;
