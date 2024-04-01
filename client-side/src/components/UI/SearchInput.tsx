import React from "react";
import classes from "./SearchInput.module.css";
import MagnifyingGlass from "../../assets/icons/MagnifyingGlass";

type Props = {
	inputName: string;
	className?: string; //additional className attribute for the input containing div
	inputClassName?: string;
	inputType?: string;
	placeholder?: string;
	defaultValue?: string;
	onInputChange?: (...args: any[]) => any;
	onIconClick?: (...args: any[]) => any; //basically the onSubmit function for the input
};

//generic component that is used on the app where search input is needed. has customized input inside an containing div, both are configurable by parent and both has pre-made css styles. also allow calling parent to pass it's ref for the input
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
			{/*magnifing class icon, act as the submit function for the input*/}
			<MagnifyingGlass className={classes.icon} onClick={props.onIconClick} />
		</div>
	);
});

export default SearchInput;
