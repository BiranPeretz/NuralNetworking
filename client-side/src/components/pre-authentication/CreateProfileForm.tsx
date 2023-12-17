import React, { useRef, useState, Fragment } from "react";
import classes from "./Forms.module.css";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../store/userSlice";
import { RootState } from "../../store/store";
import LabledInput from "../UI/LabledInput";
import getToken from "../../util/getToken";
import useLogout from "../../custom-hooks/useLogout";
import FileUpload from "../UI/FileUpload";
import ReactDOM from "react-dom";
import Modal from "../UI/Modal";
import { IoMdCheckmark } from "react-icons/io";
import createProfileFormClasses from "./CreateProfileForm.module.css";

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

	const [displayFileUploader, setDisplayFileUploader] =
		useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>();

	const fullNameRef = useRef<HTMLInputElement>(null);
	const profilePictureRef = useRef<HTMLInputElement>(null);
	const aboutRef = useRef<HTMLInputElement>(null);

	const hideFileUploader = function () {
		setDisplayFileUploader(false);
	};

	const showFileUploader = function () {
		setDisplayFileUploader(true);
	};

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

			const formData = new FormData();

			formData.append("fullName", fullNameRef.current!.value);
			if (aboutRef?.current?.value) {
				formData.append("about", aboutRef.current!.value);
			}
			if (imageFile) {
				formData.append("image", imageFile);
			}

			const res = await fetch(
				import.meta.env.VITE_SERVER_URL + "users/CreateProfile",
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
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
		<Fragment>
			<Form className={classes.form} onSubmit={submitFormHandler}>
				<LabledInput
					type="text"
					name="Name"
					placeholder="Enter your full name"
					ref={fullNameRef}
				/>
				<LabledInput
					type="text"
					name="about"
					placeholder="Tell us about yourself (optional)"
					ref={aboutRef}
				/>
				<div className={createProfileFormClasses["upload-file-container"]}>
					{imageFile ? (
						<Fragment>
							<h3>File successfully uploaded!</h3>
							<button
								type="button"
								name="change-file"
								style={{ backgroundColor: "lightgreen" }}
								onClick={showFileUploader}
							>
								Change file
							</button>
						</Fragment>
					) : (
						<Fragment>
							<h3>Profile picture</h3>
							<button
								type="button"
								name="upload-file"
								onClick={showFileUploader}
							>
								Upload file
							</button>
						</Fragment>
					)}
				</div>

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
			{displayFileUploader &&
				ReactDOM.createPortal(
					<Modal
						title="Upload your image"
						onClose={hideFileUploader}
						className={createProfileFormClasses["file-uploader__modal"]}
						backdropClassName={
							createProfileFormClasses["file-uploader__backdrop"]
						}
					>
						<FileUpload setFile={setImageFile} />
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default CreateProfileForm;
