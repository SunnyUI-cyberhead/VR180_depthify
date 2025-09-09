import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import UploadPage from './components/UploadPage';
import ProcessingPage from './components/ProcessingPage';
import ResultPage from './components/ResultPage';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpload = useCallback((file: File) => {
    setVideoFile(file);
    setAppState(AppState.PROCESSING);
    setErrorMessage(null);
  }, []);

  const handleProcessingComplete = useCallback((url: string) => {
    setResultVideoUrl(url);
    setAppState(AppState.RESULT);
  }, []);
  
  const handleProcessingError = useCallback((error: string) => {
    setErrorMessage(error);
    setAppState(AppState.UPLOAD);
  }, []);

  const handleStartOver = useCallback(() => {
    setVideoFile(null);
    setResultVideoUrl(null);
    setErrorMessage(null);
    setAppState(AppState.UPLOAD);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOAD:
        return <UploadPage onUpload={handleUpload} errorMessage={errorMessage} />;
      case AppState.PROCESSING:
        if (!videoFile) {
            handleProcessingError("No video file found. Please try again.");
            return <UploadPage onUpload={handleUpload} errorMessage={errorMessage} />;
        }
        return <ProcessingPage videoFile={videoFile} onComplete={handleProcessingComplete} onError={handleProcessingError} />;
      case AppState.RESULT:
        if (!resultVideoUrl) {
            handleProcessingError("Video generation failed. Please try again.");
            return <UploadPage onUpload={handleUpload} errorMessage={errorMessage} />;
        }
        return <ResultPage videoUrl={resultVideoUrl} onStartOver={handleStartOver} />;
      default:
        return <UploadPage onUpload={handleUpload} errorMessage={"An unexpected error occurred. Please start over."} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <header className="w-full max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          VR180 Immersive Converter
        </h1>
        <p className="text-gray-400 mt-2">Transform 2D clips into breathtaking VR180 experiences with AI.</p>
      </header>
      <main className="w-full flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;