import React from "react";
import classes from "./SearchInput.module.css";
import MagnifyingGlass from "../../assets/icons/MagnifyingGlass";

type Props = {
	inputName: string;
	className?: string;
	inputClassName?: string;
	inputType?: string;
	placeholder?: string;
	defaultValue?: string;
	onInputChange?: (...args: any[]) => any;
	onIconClick?: (...args: any[]) => any;
};

const SearchInput = React.forwardRef(function SearchInput(
	props: Props,
	ref: React.Ref<HTMLInputElement>
) {
	return (
		<div className={`${classes.container} ${props.className || ""}`}>
			<input
				className={`${classes.input} ${props.inputClassName || ""}`}
				type={props.inputType || "text"}
				name={props.inputName}
				placeholder={props.placeholder}
				defaultValue={props.defaultValue}
				onChange={props.onInputChange}
				ref={ref}
			/>

			<MagnifyingGlass className={classes.icon} onClick={props.onIconClick} />
		</div>
	);
});

export default SearchInput;
