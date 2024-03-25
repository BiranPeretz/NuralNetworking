import classes from "./icons.module.css";
import type { Props } from "./MagnifyingGlass";

const Send: React.FC<Props> = function (props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="23"
			height="21"
			viewBox="0 0 23 21"
			fill="none"
			className={`${classes.send} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<path
				d="M3.15353 7.42099L3.88688 8.70907C4.35376 9.52914 4.58718 9.9391 4.58718 10.3887C4.58718 10.8382 4.35376 11.2482 3.8869 12.0682L3.15353 13.3563C1.0653 17.0242 0.0211795 18.8584 0.835394 19.7678C1.64961 20.6772 3.57765 19.8306 7.43375 18.1373L18.0169 13.49C21.0447 12.1605 22.5586 11.4956 22.5586 10.3887C22.5586 9.28168 21.0447 8.61682 18.0169 7.28727L7.43376 2.64001C3.57767 0.946732 1.64961 0.100083 0.835394 1.00956C0.0211795 1.91904 1.0653 3.75301 3.15353 7.42099Z"
				fill="black"
			/>
		</svg>
	);
};

export default Send;
