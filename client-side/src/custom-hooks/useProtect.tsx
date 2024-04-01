import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyData } from "../store/userThunks";
import { AppDispatch, RootState } from "../store/store";
import useLogout from "./useLogout";
import type userType from "../types/user";
import getToken from "../util/getToken";

//custom hook for application's protected routes. this hook will check if the user is authenticated before accessing protected routes, and, if not, will logout and navigate the user to the welcome page
export function useProtect() {
	const [isLoading, setIsLoading] = useState(true);
	const user = useSelector((state: RootState) => state.user) as userType;
	const dispatch = useDispatch<AppDispatch>(); //store's thunks dispatch function
	const logout = useLogout(); //application's logout hook, execute logout functionality when called
	const dataFetched = useRef(false); //has data been fetched indicatior

	useEffect(() => {
		if (dataFetched.current) {
			return;
		}

		//the function that check user's authentication status and fetch hes data if needed
		async function fetchData() {
			const token = getToken(); //JWT token
			if (!token) {
				//unauthenticated user, logout and redirect to welcome page
				logout();
				setIsLoading(false);
				return;
			}

			if (!user.fullName) {
				//try to fetch user's data if not found in store's state
				try {
					//fetch user's data
					await dispatch(getMyData(token));
				} catch (error) {
					if (error instanceof Error) {
						console.error(error.message);
					} else if (typeof error === "string") {
						console.error(error);
					} else {
						console.error("Unexpected error type:", error);
					}
				}
			}
			setIsLoading(false);
		}

		fetchData();
		dataFetched.current = true;
	}, [user._id, user.fullName, dispatch, logout]); //re-execute if changed user, or new user's data been fetched

	return { isLoading, user };
}
