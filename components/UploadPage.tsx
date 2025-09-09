import React, { useState, useCallback, useRef } from 'react';
import { VideoIcon } from './icons/VideoIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface UploadPageProps {
  onUpload: (file: File) => void;
  errorMessage: string | null;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload, errorMessage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(URL.createObjectURL(file));
      } else {
        alert('Please select a valid video file.');
      }
    }
  }, [videoPreview]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };
  
  const handleConvert = () => {
      if(selectedFile) {
          onUpload(selectedFile);
      }
  };

  return (
    <div className="w-full max-w-2xl text-center">
      {errorMessage && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <div 
        className={`p-8 border-2 ${dragActive ? 'border-indigo-500' : 'border-dashed border-gray-600'} bg-gray-800 rounded-2xl transition-all duration-300`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          id="video-upload"
          className="hidden"
          accept="video/*"
          onChange={handleInputChange}
        />
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center space-y-4">
             <VideoIcon />
            <p className="text-lg text-gray-300">
              Drag & Drop your video file here or
            </p>
            <button
              onClick={onButtonClick}
              className="px-6 py-2 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
            >
              Browse Files
            </button>
             <p className="text-xs text-gray-500 pt-2 max-w-sm mx-auto">
              For best results, use common web-friendly formats like MP4, WebM, and Ogg. Support for other formats (like .MOV or .AVI) depends on your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <video src={videoPreview ?? undefined} controls className="w-full rounded-lg max-h-64 bg-black" />
            <p className="text-gray-300 font-mono text-sm">{selectedFile.name}</p>
             <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
              Note: A representative frame will be extracted to inspire the AI in generating a new immersive video. This works with files of any size.
            </p>
            <div className="flex justify-center gap-4 pt-2">
                <button
                    onClick={onButtonClick}
                    className="px-6 py-2 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                    Change Video
                </button>
                <button
                    onClick={handleConvert}
                    className="w-48 flex justify-center items-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-300"
                >
                    <SparklesIcon />
                    Convert to VR180
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;