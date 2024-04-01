import React, { Fragment, useState } from "react";
import BellIcon from "../../../assets/icons/nav-icons/Bell";
import NotificationsModal from "./NotificationsModal";
import coordinatesType from "../../../types/coordinates";
import NoNotificationsMenu from "./NoNotificationsMenu";
import NotificationsMenu from "./NotificationsMenu";

type Props = {
	displayNotifications: boolean;
	setDisplayNotifications: (display: boolean) => void;
};

//the displaing state of the notification menus type
export type MenuDisplayStateType = {
	isNoNewNotifications: boolean; //has no non-read notifications
	oldNotificationsClick: boolean; //show onld notifications button click state
};

//top level component for notifications, containing the notifications modal and control it's child component, could be the notifications menu or the no notifications menu
const Notifications: React.FC<Props> = function ({
	displayNotifications,
	setDisplayNotifications,
}) {
	const [menuDisplayState, setMenuDisplayState] =
		useState<MenuDisplayStateType>({
			isNoNewNotifications: false,
			oldNotificationsClick: false,
		});
	const [modalCoords, setModalCoords] = useState<coordinatesType>({
		x: 0,
		y: 0,
	});

	const hideNotifications = function () {
		setDisplayNotifications(false);
	};

	//the function for notifications icon click when modal was hidden. get's the icon center coordinates and display notifications modal
	const showNotifications = function (event: React.MouseEvent<SVGSVGElement>) {
		const iconClicked = (event.target as SVGSVGElement).getBoundingClientRect();
		const centerX = Math.round(iconClicked.left + iconClicked.width / 2);
		const centerY = Math.round(iconClicked.top + iconClicked.height / 2);

		setModalCoords({ x: centerX, y: centerY });
		setDisplayNotifications(true);
	};

	return (
		<Fragment>
			<BellIcon
				onClick={displayNotifications ? hideNotifications : showNotifications}
			/>
			{displayNotifications && (
				<NotificationsModal
					positionCoords={modalCoords}
					onClose={hideNotifications}
				>
					{menuDisplayState?.isNoNewNotifications === true &&
					menuDisplayState?.oldNotificationsClick === false ? (
						<NoNotificationsMenu setMenuDisplayState={setMenuDisplayState} />
					) : (
						<NotificationsMenu
							isNoNewNotifications={menuDisplayState.isNoNewNotifications}
							setMenuDisplayState={setMenuDisplayState}
						/>
					)}
				</NotificationsModal>
			)}
		</Fragment>
	);
};

export default Notifications;
