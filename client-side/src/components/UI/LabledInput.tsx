import React, { Fragment } from "react";
import classes from "./LabledInput.module.css";

type Props = {
	type: string;
	name: string;
	placeholder?: string;
	defaultValue?: string;
	displayLabel?: boolean;
	labelClassName?: string;
	inputClassName?: string;
	onChange?: (...event: any[]) => void;
	onBlur?: (...event: any[]) => void;
	error?: string;
	ref: React.Ref<any>;
};

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
