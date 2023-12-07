import React, { Fragment } from "react";
import classes from "./LabledInput.module.css";

type Props = {
	type: string;
	name: string;
	placeholder?: string;
	defaultValue?: string;
	ref?: any;
	labelClassName?: string;
	inputClassName?: string;
	children?: React.ReactNode;
};

{
}

const LabledInput = React.forwardRef(function LabledInput(
	props: Props,
	ref: React.Ref<HTMLInputElement>
) {
	return (
		<Fragment>
			<label
				className={
					props.labelClassName
						? `${classes.label} ${props.labelClassName}`
						: classes.label
				}
				htmlFor={props.name}
			>
				{props.name.charAt(0).toUpperCase() + props.name.slice(1)}
			</label>
			<input
				className={
					props.inputClassName
						? `${classes.input} ${props.inputClassName}`
						: classes.input
				}
				type={props.type}
				name={props.name}
				placeholder={props.placeholder}
				defaultValue={props.defaultValue}
				ref={ref}
			/>
		</Fragment>
	);
});

export default LabledInput;
