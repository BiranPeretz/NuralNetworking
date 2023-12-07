import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { groupConnectionType } from "../types/user";

export function usePageHosts() {
	// const groupsList = useSelector(
	// 	(state: RootState) => state.user.groupsList
	// ) as groupConnectionType[];

	// const hostsArray = groupsList?.map((item) => item?.group);

	return hostsArray;
}
