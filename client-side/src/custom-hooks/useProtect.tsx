import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyData } from "../store/userThunks";
import { AppDispatch, RootState } from "../store/store";
import useLogout from "./useLogout";
import type userType from "../types/user";
import getToken from "../util/getToken";

export function useProtect() {
	const [isLoading, setIsLoading] = useState(true);
	const user = useSelector((state: RootState) => state.user) as userType;
	const dispatch = useDispatch<AppDispatch>();
	const logout = useLogout();
	const dataFetched = useRef(false);

	useEffect(() => {
		if (dataFetched.current) {
			return;
		}

		async function fetchData() {
			const token = getToken();
			if (!token) {
				logout();
				setIsLoading(false);
				return;
			}

			if (!user.fullName) {
				try {
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
	}, [user.fullName, dispatch, logout]);

	return { isLoading, user };
}
