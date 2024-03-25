import React, { useState, Fragment } from "react";
import classes from "./FileUpload.module.css";
import ReactDOM from "react-dom";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Modal from "./Modal";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

type Props = {
	setFile: (file: any) => void;
	displayFileUploader: boolean;
	onModalClose: () => void;
};

const FileUpload: React.FC<Props> = function ({
	setFile,
	displayFileUploader,
	onModalClose,
}) {
	const [files, setFiles] = useState<any[]>([]);

	const fileUpdateHandler = function (files: any[]) {
		setFiles(files);
		const imageFileObj = files?.map((item) => item.file)[0];
		setFile(imageFileObj);
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
