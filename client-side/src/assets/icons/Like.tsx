import classes from "./icons.module.css";
import type { Props } from "./MagnifyingGlass";

const Like: React.FC<Props> = function (props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 22 22"
			fill="none"
			className={`${classes.like} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<path
				d="M6.85742 16.8213L9.69911 19.0213C10.0658 19.3879 10.8908 19.5713 11.4408 19.5713H14.9241C16.0241 19.5713 17.2158 18.7463 17.4908 17.6463L19.6908 10.9546C20.1491 9.67128 19.3241 8.57125 17.9491 8.57125H14.2824C13.7324 8.57125 13.2741 8.11292 13.3658 7.47125L13.8241 4.53792C14.0074 3.71292 13.4574 2.79625 12.6324 2.52125C11.8991 2.24625 10.9824 2.61292 10.6158 3.16292L6.85742 8.75458"
				stroke="black"
				strokeWidth="2"
				strokeMiterlimit="10"
			/>
			<path
				d="M2.18164 16.8207V7.83737C2.18164 6.55404 2.73164 6.0957 4.01497 6.0957H4.93164C6.21497 6.0957 6.76497 6.55404 6.76497 7.83737V16.8207C6.76497 18.104 6.21497 18.5624 4.93164 18.5624H4.01497C2.73164 18.5624 2.18164 18.104 2.18164 16.8207Z"
				stroke="black"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Like;
