import { useState, useEffect, useRef } from "react";
import getToken from "../util/getToken";
import socialItemType from "../types/socialItem";

//this hook will request all user's owned pages and will return them as a array of social items. this could help the requesting component to understand the list of potential page hosts for the user (pages that the user can post on their behalf)
export function usePageHosts() {
	const token = getToken(); //JWT token
	const [hosts, setHosts] = useState<socialItemType[] | undefined>(undefined);
	const dataFetched = useRef<boolean>(false); //boolean flag to mark when data has been fetched

	useEffect(() => {
		//only procceed if no data been fetched already
		if (!dataFetched.current) {
			//define data fetching function
			const fetchPages = async () => {
				try {
					//request owned pages
					const response = await fetch(
						`${import.meta.env.VITE_SERVER_URL}pages/getMyPages`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
						}
					);

					//parse request's response
					const data = await response.json();
					//evaluate request's response status
					if (!(data?.status === "success")) {
						throw new Error(`client-error:${data.message}`);
					}

					setHosts(data.data.myPages);
					dataFetched.current = true;
				} catch (error) {
					console.error(error);
				}
			};

			//call data fetching function
			fetchPages();
		}
	}, []);

	return hosts;
}
