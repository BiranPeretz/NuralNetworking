import classes from "./icons.module.css";

import type { Props } from "./MagnifyingGlass";

const TrashItem: React.FC<Props> = function (props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={`${classes.trash} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<circle cx="12" cy="12" r="11.5" fill="white" stroke="#312D2D" />
			<path
				d="M6 8H18"
				stroke="#312D2D"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.5 8V16.25C7.5 17.4927 8.50736 18.5 9.75 18.5H14.25C15.4927 18.5 16.5 17.4927 16.5 16.25V8"
				stroke="#312D2D"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M9.75 6.5C9.75 5.67157 10.4216 5 11.25 5H12.75C13.5784 5 14.25 5.67157 14.25 6.5V8H9.75V6.5Z"
				stroke="#312D2D"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default TrashItem;
