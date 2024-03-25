import classes from "./icons.module.css";
import type { Props } from "./MagnifyingGlass";

const CloseX: React.FC<Props> = function (props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			className={`${classes["close-x"]} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.358648 0.358977C0.83694 -0.119563 1.61252 -0.119673 2.09094 0.358731L7 5.26755L11.9091 0.358731C12.3875 -0.119673 13.1631 -0.119563 13.6414 0.358977C14.1196 0.837516 14.1195 1.61327 13.6411 2.09168L8.73254 7L13.6411 11.9083C14.1195 12.3867 14.1196 13.1625 13.6414 13.641C13.1631 14.1196 12.3875 14.1197 11.9091 13.6413L7 8.73246L2.09094 13.6413C1.61252 14.1197 0.83694 14.1196 0.358648 13.641C-0.119645 13.1625 -0.119535 12.3867 0.358893 11.9083L5.26746 7L0.358893 2.09168C-0.119535 1.61327 -0.119645 0.837516 0.358648 0.358977Z"
				fill="#000000"
			/>
		</svg>
	);
};

export default CloseX;
