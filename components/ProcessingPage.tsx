
import React, { useState, useEffect, useCallback } from 'react';
import { convertVideoToVR180 } from '../services/geminiService';
import { PROCESSING_MESSAGES } from '../constants';

interface ProcessingPageProps {
  videoFile: File;
  onComplete: (url: string) => void;
  onError: (error: string) => void;
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ videoFile, onComplete, onError }) => {
  const [currentMessage, setCurrentMessage] = useState(PROCESSING_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prevMessage => {
        const currentIndex = PROCESSING_MESSAGES.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % PROCESSING_MESSAGES.length;
        return PROCESSING_MESSAGES[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runConversion = useCallback(async () => {
    try {
        const prompt = "Generate an immersive, ultra-wide, stereoscopic VR180 cinematic video inspired by this image. The video should have a sense of depth and peripheral detail suitable for a VR headset experience. Make it feel like you are there.";
        const resultUrl = await convertVideoToVR180(videoFile, prompt);
        if(resultUrl) {
            onComplete(resultUrl);
        } else {
            onError("Failed to generate video. The result was empty.");
        }
    } catch (err) {
        let errorMessage = 'An unknown error occurred during video conversion.';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        console.error("Conversion failed:", err);
        onError(errorMessage);
    }
  }, [videoFile, onComplete, onError]);

  useEffect(() => {
    runConversion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runConversion]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin-slow"></div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Processing Your Video...</h2>
      <p className="text-gray-300 w-full transition-opacity duration-500">{currentMessage}</p>
    </div>
  );
};

export default ProcessingPage;
