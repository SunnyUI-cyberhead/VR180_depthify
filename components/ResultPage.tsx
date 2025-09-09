import React, { useEffect } from 'react';

interface ResultPageProps {
  videoUrl: string;
  onStartOver: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ videoUrl, onStartOver }) => {

  useEffect(() => {
    // This is a cleanup function that runs when the component unmounts.
    // It's important to revoke the object URL to free up memory.
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);


  return (
    <div className="w-full max-w-4xl text-center p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-3xl font-bold text-white mb-4">Your Immersive VR180 Video is Ready!</h2>
      <p className="text-gray-400 mb-6">Play the video below or download it for your VR headset.</p>
      
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
        <video src={videoUrl} controls autoPlay className="w-full h-full" />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={videoUrl}
          download="vr180_video.mp4"
          className="px-8 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-300"
        >
          Download Video
        </a>
        <button
          onClick={onStartOver}
          className="px-8 py-3 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors duration-300"
        >
          Convert Another Video
        </button>
      </div>
    </div>
  );
};

export default ResultPage;