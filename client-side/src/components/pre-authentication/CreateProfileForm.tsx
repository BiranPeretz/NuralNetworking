import React, { useRef } from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../store/userSlice";
import { RootState } from "../../store/store";
import LabledInput from "../UI/LabledInput";
import getToken from "../../util/getToken";
import useLogout from "../../custom-hooks/useLogout";

type Props = {
	onCloseModal: () => void;
};

//TODO: refactor to combine with other forms?
const CreateProfileForm: React.FC<Props> = function (props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const logout = useLogout();
	const { email } = useSelector((state: RootState) => state.user);
	const token = getToken();

	const fullNameRef = useRef<HTMLInputElement>(null);
	const profilePictureRef = useRef<HTMLInputElement>(null);
	const aboutRef = useRef<HTMLInputElement>(null);

	const notMeHandler = function (event: React.MouseEvent) {
		event.preventDefault();
		props.onCloseModal();
		logout();
	};

	const submitFormHandler = async function (event: React.FormEvent) {
		event.preventDefault();
		try {
			if (!fullNameRef.current!.value) {
				//TODO: handle/dispaly full name is missing to the user
				return;
			}

			const bodyObj = {
				fullName: fullNameRef.current!.value,
				profilePicture: profilePictureRef.current!.value || undefined,
				about: aboutRef.current!.value || undefined,
			};

			const res = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/CreateProfile",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(bodyObj),
				}
			);
			console.log(res.body);

			const data = await res?.json();
			if (!res?.ok) {
				console.log(data);
				//TODO: handle the errors sent by the server and leave the message logging/displaing to the catch block
				return;
			}

			dispatch(createProfile(data.data.user));
			navigate("/feed");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Form method="post" className={classes.form} onSubmit={submitFormHandler}>
			<LabledInput
				type="text"
				name="Name"
				placeholder="Enter your full name"
				ref={fullNameRef}
			/>
			<LabledInput
				type="text"
				name="Picture"
				placeholder="enter profile picture URL (optional)"
				ref={profilePictureRef}
			/>
			<LabledInput
				type="text"
				name="about"
				placeholder="Tell us about yourself (optional)"
				ref={aboutRef}
			/>
			<h6>
				Creating profile for{" "}
				<strong
					style={{
						textDecoration: "underline",
						textUnderlineOffset: "2px",
					}}
				>
					{email}
				</strong>
				. <span onClick={notMeHandler}>Not me</span>
			</h6>
			<button type="submit">Create profile!</button>
		</Form>
	);
};

export default CreateProfileForm;
