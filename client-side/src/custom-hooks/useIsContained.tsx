import { useSelector } from "react-redux";
import { RootState } from "../store/store";

//util custom hook recieve a social item ID as parameter + its type and return boolean value that indicate if the social item is contained inside the corresponding user's list
function useIsContained(
	socialType: "user" | "group" | "page",
	itemID: string
): boolean {
	const userState = useSelector((state: RootState) => state.user); //user store's state data
	let itemsIdArray;

	switch (socialType) {
		case "user":
			itemsIdArray = userState.friendsList.map((item) =>
				item.friend._id?.toString()
			);
			//social type "user" could also be found on user's firend requests list
			const requestsIdArray = userState.friendRequestsList.map((item) =>
				item.friendRequest._id?.toString()
			);

			return (
				itemsIdArray.includes(itemID) ||
				requestsIdArray.includes(itemID) ||
				userState._id === itemID
			);
		case "group":
			itemsIdArray = userState.groupsList.map((item) =>
				item.group._id?.toString()
			);
			return itemsIdArray.includes(itemID);
		case "page":
			itemsIdArray = userState.pagesList.map((item) =>
				item.page._id?.toString()
			);
			return itemsIdArray.includes(itemID);
	}
}

export default useIsContained;
