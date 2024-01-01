//TODO: not in use for now due to initial notifications fetch need to be moved in nav-bar. find workaround or delete.
import React, { ReactElement } from "react";
//import classes from './CountingBadge.module.css';

type Props = {
	icon: ReactElement;
	count: number;
	children?: React.ReactNode;
};

const CountingBadge: React.FC<Props> = function (props) {
	return (
		<div className="badge">
			{props.icon}
			{props.count > 0 && <span className="counter">{props.count}</span>}
		</div>
	);
};

export default CountingBadge;
