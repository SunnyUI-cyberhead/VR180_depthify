export const extractFrame = (
  videoFile: File,
  seekTo: number = 0.5
): Promise<{ base64Data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    // Create a video element
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    // Hide the video element from the user
    video.style.position = 'fixed';
    video.style.top = '-10000px';
    video.style.left = '-10000px';

    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;

    const cleanup = () => {
      // Revoke the object URL and remove the video element to free up resources
      URL.revokeObjectURL(videoUrl);
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
    };

    video.onloadedmetadata = () => {
      // Seek to the desired frame
      if (video.duration > 0) {
        video.currentTime = video.duration * seekTo;
      } else {
        cleanup();
        reject(new Error('Video has no duration. It may be corrupt or an unsupported format.'));
      }
    };

    video.onseeked = () => {
      // The video has sought to the correct time, now capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        cleanup();
        return reject(new Error('Could not get canvas context.'));
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const mimeType = 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.9); // 0.9 quality
      const base64Data = dataUrl.split(',')[1];
      
      cleanup();
      resolve({ base64Data, mimeType });
    };

    video.onerror = () => {
      let errorMessage = 'Failed to load or process video file.';
      if (video.error) {
          switch (video.error.code) {
              case video.error.MEDIA_ERR_ABORTED:
                  errorMessage = 'The video playback was aborted.';
                  break;
              case video.error.MEDIA_ERR_NETWORK:
                  errorMessage = 'A network error caused the video download to fail.';
                  break;
              case video.error.MEDIA_ERR_DECODE:
                  errorMessage = 'The video could not be decoded, possibly due to corruption or an unsupported format.';
                  break;
              case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  errorMessage = 'The video format is not supported.';
                  break;
              default:
                  errorMessage = 'An unknown error occurred while processing the video.';
                  break;
          }
      }
      cleanup();
      reject(new Error(errorMessage));
    };

    // Add the video element to the DOM. This is crucial for some browsers to
    // properly handle video loading and seeking.
    document.body.appendChild(video);
  });
};
