import classes from "./icons.module.css";
import type { Props } from "./MagnifyingGlass";

const Envelope: React.FC<Props> = function (props) {
	return (
		<svg
			fill="#000000"
			width="20px"
			height="20px"
			viewBox="0 0 32 32"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className={`${classes.envelope} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				{" "}
				<title>envelope</title>{" "}
				<path d="M28 3.75h-24c-1.794 0.002-3.248 1.456-3.25 3.25v18c0.002 1.794 1.456 3.248 3.25 3.25h24c1.794-0.001 3.249-1.456 3.25-3.25v-18c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM4 6.25h24c0.219 0.001 0.415 0.097 0.549 0.248l0.001 0.001-12.55 8.964-12.55-8.964c0.135-0.152 0.331-0.248 0.549-0.249h0zM28 25.75h-24c-0.414-0-0.75-0.336-0.75-0.75v-15.571l12.023 8.588c0.031 0.018 0.069 0.037 0.108 0.054l0.008 0.003c0.031 0.018 0.068 0.037 0.107 0.054l0.008 0.003c0.145 0.070 0.315 0.113 0.494 0.118l0.002 0h0.002c0.181-0.005 0.351-0.048 0.503-0.121l-0.008 0.003c0.046-0.020 0.084-0.039 0.12-0.060l-0.006 0.003c0.047-0.020 0.085-0.040 0.121-0.061l-0.006 0.003 12.023-8.588v15.571c-0 0.414-0.336 0.75-0.75 0.75v0z"></path>{" "}
			</g>
		</svg>
	);
};

export default Envelope;
