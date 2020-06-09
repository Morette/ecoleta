import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
	onFileUpload: (file: File) => void;
}

const DropZone: React.FC<Props> = ({ onFileUpload }) => {
	const [urlFileSelected, setUrlFileSelected] = useState('');

	const onDrop = useCallback(
		acceptedFiles => {
			const file = acceptedFiles[0];

			const fileUrl = URL.createObjectURL(file);
			setUrlFileSelected(fileUrl);
			onFileUpload(file);
		},
		[onFileUpload],
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: 'image/*',
	});

	return (
		<div className='dropzone' {...getRootProps()}>
			<input {...getInputProps()} accept='image/* ' />

			{urlFileSelected ? (
				<img src={urlFileSelected} alt='Thumbnail' />
			) : (
				<p>
					<FiUpload />
					Imagem do estabelecimento
				</p>
			)}
		</div>
	);
};

export default DropZone;
