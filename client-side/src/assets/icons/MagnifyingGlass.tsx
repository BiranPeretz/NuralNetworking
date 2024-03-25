import classes from "./icons.module.css";

export type Props = {
	className?: string;
	onClick?: (args: any) => any;
};

const MagnifyingGlass: React.FC<Props> = function (props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			className={`${classes["magnifying-glass"]} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<path
				d="M10.115 10.0941L13 13M11.6667 6.33333C11.6667 9.27887 9.27887 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27887 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27887 1 11.6667 3.38781 11.6667 6.33333Z"
				stroke="#4C4C5A"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default MagnifyingGlass;
