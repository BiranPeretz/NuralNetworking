//import classes from './PagesFeedPage.module.css'
// import PagesFeed from "../../components/feed/pages/PagesFeed";
import Feed from "../../components/feed/Feed";

const PagesFeedPage = function () {
	// return <PagesFeed />;
	return <Feed creatorType="Page" feedType="pages" />;
};

export default PagesFeedPage;
