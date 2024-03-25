import classes from "./icons.module.css";

const FriendFeedIcon = (sizeMultiplier: number = 1) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={(27 * sizeMultiplier).toString()}
		height={(27 * sizeMultiplier).toString()}
		viewBox="0 0 27 27"
		fill="none"
		className={classes.friends}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10 0C6.6863 0 4 2.6863 4 6C4 9.3137 6.6863 12 10 12C13.3138 12 16 9.3137 16 6C16 2.6863 13.3138 0 10 0ZM5.89474 6C5.89474 3.73272 7.73272 1.89474 10 1.89474C12.2672 1.89474 14.1053 3.73272 14.1053 6C14.1053 8.26728 12.2672 10.1053 10 10.1053C7.73272 10.1053 5.89474 8.26728 5.89474 6Z"
			fill="#323232"
		/>
		<path
			d="M18 1C17.4477 1 17 1.44772 17 2C17 2.55228 17.4477 3 18 3C19.6568 3 21 4.34315 21 6C21 7.65685 19.6568 9 18 9C17.4477 9 17 9.44772 17 10C17 10.5523 17.4477 11 18 11C20.7615 11 23 8.76143 23 6C23 3.23857 20.7615 1 18 1Z"
			fill="#323232"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.1331 15.7384C4.93874 14.6443 7.36861 14 10 14C12.6314 14 15.0613 14.6443 16.867 15.7384C18.6452 16.8161 20 18.4612 20 20.5C20 22.5388 18.6452 24.1839 16.867 25.2616C15.0613 26.3557 12.6314 27 10 27C7.36861 27 4.93874 26.3557 3.1331 25.2616C1.35484 24.1839 0 22.5388 0 20.5C0 18.4612 1.35484 16.8161 3.1331 15.7384ZM4.09337 17.5207C2.60259 18.4241 1.93548 19.5157 1.93548 20.5C1.93548 21.4843 2.60259 22.5759 4.09337 23.4793C5.55676 24.3662 7.64302 24.9474 10 24.9474C12.357 24.9474 14.4432 24.3662 15.9066 23.4793C17.3974 22.5759 18.0645 21.4843 18.0645 20.5C18.0645 19.5157 17.3974 18.4241 15.9066 17.5207C14.4432 16.6338 12.357 16.0526 10 16.0526C7.64302 16.0526 5.55676 16.6338 4.09337 17.5207Z"
			fill="#323232"
		/>
		<path
			d="M22.2144 16.0221C21.675 15.9107 21.1417 16.2321 21.0234 16.7402C20.9052 17.2483 21.2465 17.7506 21.7859 17.8619C22.8424 18.0802 23.6866 18.4549 24.244 18.8844C24.8019 19.3143 25.0001 19.7344 25.0001 20.0813C25.0001 20.3961 24.8393 20.7657 24.396 21.1536C23.9494 21.5443 23.2635 21.9051 22.3786 22.1562C21.8497 22.3061 21.5501 22.8314 21.7093 23.3295C21.8686 23.8275 22.4263 24.1097 22.9551 23.9598C24.0518 23.6487 25.0325 23.1677 25.7571 22.5336C26.485 21.8967 27 21.059 27 20.0813C27 18.9954 26.3678 18.0872 25.5105 17.4266C24.6525 16.7653 23.4968 16.2869 22.2144 16.0221Z"
			fill="#323232"
		/>
	</svg>
);

export default FriendFeedIcon;