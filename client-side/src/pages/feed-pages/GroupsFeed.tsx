//import classes from './GroupsFeedPage.module.css'
// import GroupsFeed from "../../components/feed/groups/GroupsFeed";
import Feed from "../../components/feed/Feed";

const GroupsFeedPage = function () {
	// return <GroupsFeed />;
	return <Feed creatorType="Group" feedType="groups" />;
};

export default GroupsFeedPage;
