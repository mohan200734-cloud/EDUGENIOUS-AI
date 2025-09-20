
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleFile = useCallback((file: File | null) => {
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            onFileChange(file);
        } else {
            setFileName(null);
            onFileChange(null);
            // Optionally, show an error to the user
            if(file) alert("Please upload a valid PDF file.");
        }
    }, [onFileChange]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div>
            <label
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-brand-primary bg-gray-700' : 'border-gray-600 bg-gray-900 hover:bg-gray-700'}`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-brand-muted">
                        <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-brand-muted">PDF only</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleInputChange} />
            </label>
            {fileName && (
                <div className="mt-4 text-center text-green-400">
                    <p>File selected: <span className="font-medium">{fileName}</span></p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
