import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Card from "./Card";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

type Props = {
	setFile: (file: any) => void;
	children?: React.ReactNode;
};

const FileUpload: React.FC<Props> = function (props) {
	const [files, setFiles] = useState<any[]>([]);

	const fileUpdateHandler = function (files: any[]) {
		setFiles(files);
		const imageFileObj = files?.map((item) => item.file)[0];
		props.setFile(imageFileObj);
	};

	return (
		<FilePond
			files={files}
			onupdatefiles={fileUpdateHandler}
			name="files"
			labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
		/>
	);
};

export default FileUpload;
