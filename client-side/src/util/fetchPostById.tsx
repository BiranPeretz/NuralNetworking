import type UserPost from "../types/old-types/userPost";
import type { RootState } from "../store/old-store/store";
import { useSelector } from "react-redux";

const fetchPostById = function (postId: string): UserPost | undefined {
	const userSlice = useSelector((state: RootState) => state.user);

	return userSlice.userPosts.find((post) => post.id === postId);
};

export default fetchPostById;
