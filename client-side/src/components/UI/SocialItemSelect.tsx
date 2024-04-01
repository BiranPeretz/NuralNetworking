import React from "react";
import socialItemType from "../../types/socialItem";
import classes from "./SocialItemSelect.module.css";
import ProfilePicture from "./ProfilePicture";
import Select from "react-select"; //custom drop-down select component

type Props = {
	setSelectedOption: (selectedItem: any) => void; //parent's function to set the available drop-down options
	socialItemsArray: socialItemType[]; //array of social items(users/groups/pages) available as drop-down options
	placeholder: string; //select input's text placeholder value, displayed before any option is selected.
	selectedOption?: any; //the currently selected option
};

//semi-util custom component for parent's drop-down component items. handles the library requirements for configurating an item. items are displayed as profile picture + the item's name inside a div container
const SocialItemComponent: React.FC<{
	data: {
		value: string; //supported lib's data object
		label: string; //item's name
		profilePicture: string | undefined;
	};
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

//custom drop-down component for social items of this application. uses react-select components with the custom SocialItemComponent that is configured to work as drop-down option according to this lib's docs and the application needs
const SocialItemSelect: React.FC<Props> = function ({
	setSelectedOption,
	socialItemsArray,
	placeholder,
	selectedOption,
}) {
	//array of social items used as the option attribute for react-select drop-down component
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
