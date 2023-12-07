import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserData } from "../store/userSlice";
import { clearPostsData } from "../store/postsSlice";
import { clearSuggestionsData } from "../store/suggestionsSlice";

//this hook cluster required hooks to enable user logout
const useLogout = function () {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	//this function preform the logout operations
	const logout = function () {
		//step 1: remove authentication token from local storage
		localStorage.removeItem("token");

		//step 2: reset redux store data to initial values
		dispatch(clearUserData());
		dispatch(clearPostsData());
		dispatch(clearSuggestionsData());

		//step 3: redirect the user to welcome screen
		navigate("/");
	};

	return logout;
};

export default useLogout;
