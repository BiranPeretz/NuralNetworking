import React, { useState, Fragment } from "react";
import classes from "./FileUpload.module.css";
import ReactDOM from "react-dom";
import { FilePond, registerPlugin } from "react-filepond"; //FilePond: file uploading component. registerPlugin: required function for plugin registration
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"; //for filepond's plugin registration
import FilePondPluginImagePreview from "filepond-plugin-image-preview"; //for filepond's plugin registration
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"; //filepont's css styles
import Modal from "./Modal";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview); //register filePond plugin, requirment of the library

type Props = {
	setFile: (file: any) => void; //parent's file state setter function
	displayFileUploader: boolean; //boolean display/hide file uploading modal
	onModalClose: () => void;
};

//custom component that handles file uploading in this application. this component use filePond library to handle everything front-end related including reading file, file validation functions, file state manegment and more. the component wraps the FilePond component with a Modal component and controll it's functionalities via parent's props
const FileUpload: React.FC<Props> = function ({
	setFile,
	displayFileUploader,
	onModalClose,
}) {
	const [files, setFiles] = useState<any[]>([]); //uploaded files array state

	//this function handles updates for the uploaded files state. the function will recieve files to upload and will return only the first one as multiple files upload is not supported in this application
	const fileUpdateHandler = function (files: any[]) {
		setFiles(files); //set input files as uploaded files state value
		const imageFileObj = files?.map((item) => item.file)[0]; //return only the first item of uploaded files array
		setFile(imageFileObj); //set first item as uploaded files array
	};

	return (
		<Fragment>
			{displayFileUploader &&
				ReactDOM.createPortal(
					<Modal
						title="Upload your image"
						onClose={onModalClose}
						className={classes.modal}
						backdropClassName={classes.backdrop}
					>
						<FilePond
							files={files}
							onupdatefiles={fileUpdateHandler}
							name="files"
							labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
						/>
					</Modal>,
					document.getElementById("root-overlay")!
				)}
		</Fragment>
	);
};

export default FileUpload;
