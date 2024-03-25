import classes from "./icons.module.css";

const PageFeedIcon = (sizeMultiplier: number = 1) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={(19 * sizeMultiplier).toString()}
		height={(27 * sizeMultiplier).toString()}
		viewBox="0 0 19 27"
		fill="none"
		className={classes.pages}
	>
		<path
			d="M1 26V16M1 16V3.5M1 16L4.0001 15.3824C6.00431 14.9698 8.08184 15.166 9.97952 15.9475C12.036 16.7943 14.2993 16.9524 16.4481 16.3994L16.7085 16.3324C17.4675 16.137 18 15.435 18 14.6296V5.42086C18 4.44516 17.1093 3.72924 16.1897 3.96588C14.209 4.47564 12.1225 4.32986 10.2269 3.54929L9.97952 3.44746C8.08184 2.66605 6.00431 2.4697 4.0001 2.88234L1 3.5M1 3.5V1"
			stroke="black"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);
export default PageFeedIcon;
