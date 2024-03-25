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

export type MenuDisplayStateType = {
	isNoNewNotifications: boolean;
	oldNotificationsClick: boolean;
};

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
