import React, { ChangeEvent } from 'react';

interface FileUploaderProps {
    setAudioBlob: (blob: Blob | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ setAudioBlob }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAudioBlob(file ? new Blob([file], { type: file.type }) : null);
    };

    return (
        <div className="mb-4">
            <label htmlFor="audio" className="block mb-2">
                Audio file:
            </label>
            <input type="file" name="audio" onChange={handleFileChange} className="w-96 p-4" />
        </div>
    );
};

export default FileUploader;
