//terrible way of implementing this options modal, refactor heavly after MVP.

import type { ModalOptionItemType } from "../types/old-types/modalOptionItem";
import { BsPin } from "react-icons/bs";
import { RiUserUnfollowLine } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { BiBlock } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlinePostAdd } from "react-icons/md";

const calcUnconnectOption = function (socialType: string): ModalOptionItemType {
	const option: ModalOptionItemType = {
		icon: undefined,
		title: "",
	};
	switch (socialType) {
		case "friend":
			option.icon = <RiUserUnfollowLine />;
			option.title = "Unfriend";
			break;
		case "group":
			option.icon = <ImExit />;
			option.title = "Leave";
			break;
		case "page":
			option.icon = <RiUserUnfollowLine />;
			option.title = "Unfollow";
			break;
	}
	return option;
};

const calcInteractOption = function (socialType: string): ModalOptionItemType {
	const option: ModalOptionItemType = {
		icon: undefined,
		title: "",
	};
	switch (socialType) {
		case "friend":
			option.icon = <AiOutlineMessage />;
			option.title = "Message";
			break;
		case "group":
			option.icon = <MdOutlinePostAdd />;
			option.title = "Post";
			break;
		case "page":
			option.icon = <AiOutlineMessage />;
			option.title = "Message";
			break;
	}
	return option;
};

const fetchOptionsBySocialType = function (
	socialType: string
): ModalOptionItemType[] {
	const pinOption: ModalOptionItemType = {
		icon: <BsPin />,
		title: "Pin",
	};

	const unconnectOption = calcUnconnectOption(socialType);

	const blockOption: ModalOptionItemType = {
		icon: <BiBlock />,
		title: "Block",
	};

	const interactOption = calcInteractOption(socialType);

	return [pinOption, unconnectOption, blockOption, interactOption];
};

export default fetchOptionsBySocialType;
