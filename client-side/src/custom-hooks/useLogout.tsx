import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { clearUserData } from "../store/userSlice";
import { clearPostsData } from "../store/postsSlice";
import { clearSuggestionsData } from "../store/suggestionsSlice";

//custom hook that cluster required actions to preform user logout in this application
const useLogout = function () {
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const navigate = useNavigate();

	//the function that preform the logout operations
	const logout = function () {
		//remove authentication token from local storage
		localStorage.removeItem("token");

		//reset the entire store data
		dispatch(clearUserData());
		dispatch(clearPostsData());
		dispatch(clearSuggestionsData());

		//redirect the user to welcome screen
		navigate("/");
	};

	return logout;
};

export default useLogout;
