import React from "react";
import classes from "./SearchInput.module.css";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";

type Props = {
	inputName: string;
	className?: string;
	inputClassName?: string;
	inputType?: string;
	placeholder?: string;
	iconSize?: string;
	onInputChange?: (...args: any[]) => any;
	onIconClick?: (...args: any[]) => any;
};

const SearchInput = React.forwardRef(function SearchInput(
	props: Props,
	ref: React.Ref<HTMLInputElement>
) {
	const bothClassNames = props.className
		? `${classes.container} ${props.className}`
		: classes.container;

	const bothInputClassNames = props.inputClassName
		? `${classes.input} ${props.inputClassName}`
		: classes.input;
	return (
		<div className={bothClassNames}>
			<input
				className={bothInputClassNames}
				type={props.inputType || "text"}
				name={props.inputName}
				placeholder={props.placeholder}
				onChange={props.onInputChange}
				ref={ref}
			/>

			<PiMagnifyingGlassDuotone
				className={classes.icon}
				size={props.iconSize}
				onClick={props.onIconClick}
			/>
		</div>
	);
});

export default SearchInput;
