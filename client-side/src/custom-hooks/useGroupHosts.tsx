import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { groupConnectionType } from "../types/user";

//this hook access the store's state and read the user's groups list. the hook will return this list of groups that also represents the user's list of potential group hosts for creating posts
export function useGroupHosts() {
	const groupsList = useSelector(
		(state: RootState) => state.user.groupsList
	) as groupConnectionType[]; //store's groups list

	const hostsArray = groupsList?.map((item) => item?.group); //remove the connection object related data

	return hostsArray;
}
