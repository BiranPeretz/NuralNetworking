import { useState, useEffect, useRef } from "react";
import getToken from "../util/getToken";
import socialItemType from "../types/socialItem";

export function usePageHosts() {
	const token = getToken();
	const [hosts, setHosts] = useState<socialItemType[] | undefined>(undefined);
	const dataFetched = useRef<boolean>(false);

	console.log("in usePageHosts");

	useEffect(() => {
		console.log("in usePageHosts, in useEffect");

		if (!dataFetched.current) {
			const fetchPages = async () => {
				try {
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

					const data = await response.json();
					if (!(data?.status === "success")) {
						throw new Error(`client-error:${data.message}`);
					}

					setHosts(data.data.myPages);
					dataFetched.current = true;
				} catch (error) {
					console.error(error);
				}
			};

			fetchPages();
		}
	}, []);

	return hosts;
}
