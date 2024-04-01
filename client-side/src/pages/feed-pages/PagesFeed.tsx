import Feed from "../../components/feed/Feed";

//uses the Feed component to create the pages feed page.
const PagesFeedPage = function () {
	return <Feed creatorType="Page" feedType="pages" />;
};

export default PagesFeedPage;
