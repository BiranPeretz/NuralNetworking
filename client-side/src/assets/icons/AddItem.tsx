import classes from "./icons.module.css";
import type { Props } from "./MagnifyingGlass";

const AddItem: React.FC<Props> = function (props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={`${classes["add-item"]} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<circle cx="12" cy="12" r="12" fill="#312D2D" />
			<path
				d="M12 18V6"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6 12H18"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default AddItem;
