import React, { Fragment } from "react";
import classes from "./LabledInput.module.css";

type Props = {
	type: string; //input's type
	name: string; //label and input name
	placeholder?: string; //input's placeholder
	defaultValue?: string; //input's default value
	displayLabel?: boolean; //boolean value to display or hide the label tag
	labelClassName?: string; //additional className attribute for the label
	inputClassName?: string; //additional className attribute for the input
	onChange?: (...event: any[]) => void; //on input's text change function
	onBlur?: (...event: any[]) => void; //on input's blur function
	error?: string; //parent's way to alert an error, mainly change label's css classes and label's text
	ref: React.Ref<any>; //parent's ref for the input
};

//generic component for the app's inputs and optionally renders matching label. has premade classes for both input and label
const LabledInput = React.forwardRef<HTMLInputElement, Props>(
	function LabledInput(
		{
			type,
			name,
			placeholder,
			defaultValue,
			displayLabel,
			labelClassName,
			inputClassName,
			onChange,
			onBlur,
			error,
			...rest
		},
		ref
	) {
		return (
			<Fragment>
				<label
					className={`${classes.label} ${labelClassName || ""} ${
						error && classes["label__error"]
					} ${displayLabel || error ? "" : classes["label__hide"]}`}
					htmlFor={name}
				>
					{displayLabel
						? name.charAt(0).toUpperCase() + name.slice(1)
						: error || ""}
				</label>
				<input
					className={`${classes.input} ${inputClassName || ""} ${
						error && classes["input__error"]
					}`}
					type={type}
					name={name}
					placeholder={placeholder}
					defaultValue={defaultValue}
					onChange={onChange}
					onBlur={onBlur}
					{...rest}
					ref={ref}
				/>
			</Fragment>
		);
	}
);

export default LabledInput;
