import React, { useState } from "react";
import socialItemType from "../../types/socialItem";
import classes from "./SocialItemSelect.module.css";
import ProfilePicture from "./ProfilePicture";
import Select from "react-select";

type Props = {
	setSelectedOption: (selectedItem: any) => void;
	socialItemsArray: socialItemType[];
	placeholder: string;
	selectedOption?: any;
};

const SocialItemComponent: React.FC<{
	data: { value: string; label: string; profilePicture: string | undefined };
	innerProps: any;
}> = function ({ data, innerProps }) {
	return (
		<div className={classes.item} key={data.value} {...innerProps}>
			<ProfilePicture
				className={classes["item__picture"]}
				src={data.profilePicture}
				ignoreDefaultSrc={true}
			/>
			<span className={classes["item__name"]}>{data.label}</span>
		</div>
	);
};

const SocialItemSelect: React.FC<Props> = function ({
	setSelectedOption,
	socialItemsArray,
	placeholder,
	selectedOption,
}) {
	const options = socialItemsArray?.map((item) => {
		return {
			value: item._id,
			label: item.name,
			profilePicture: item?.profilePicture || "",
		};
	});

	return (
		<Select
			defaultValue={selectedOption}
			onChange={setSelectedOption}
			options={options}
			components={{
				Option: SocialItemComponent,
			}}
			placeholder={placeholder}
			className={classes.select}
		/>
	);
};
export default SocialItemSelect;
