// components/FileUploader.tsx
import React, { ChangeEvent, useState } from 'react';

interface FileUploaderProps {
    setAudioBlob: (blob: Blob | null) => void;
    setTextInput: (text: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ setAudioBlob, setTextInput }) => {
    const [inputType, setInputType] = useState('audio');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        if (inputType === 'audio') {
            setAudioBlob(new Blob([file], {type: file.type}));
        } else if (inputType === 'textFile') {
            // Read the text file and set its content as the text input
            const reader = new FileReader();
            reader.onload = function (event) {
                setTextInput(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex gap-4 mb-4">
                <button type="button" onClick={() => setInputType('audio')} className={`px-4 py-2 ${inputType === 'audio' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Audio</button>
                <button type="button" onClick={() => setInputType('text')} className={`px-4 py-2 ${inputType === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Text</button>
                <button type="button" onClick={() => setInputType('textFile')} className={`px-4 py-2 ${inputType === 'textFile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Text File</button>
            </div>
            {inputType === 'audio' ? (
                <>
                    <label htmlFor="audio" className="block mb-2">Audio file:</label>
                    <input type="file" name="audio" onChange={handleFileChange} className="w-96 p-2" accept="audio/*"/>
                </>
            ) : inputType === 'textFile' ? (
                <>
                    <label htmlFor="textFile" className="block mb-2">Text file:</label>
                    <input type="file" name="textFile" onChange={handleFileChange} className="w-96 p-2" accept=".txt"/>
                </>
            ) : (
                <>
                    <label htmlFor="text" className="block mb-2">Text:</label>
                    <input type="text" name="text" onChange={(e) => setTextInput(e.target.value)} className="w-96 p-2"/>
                </>
            )}
        </div>
    );
};

export default FileUploader;
