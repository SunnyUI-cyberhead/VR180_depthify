import { GoogleGenAI } from "@google/genai";
import { extractFrame } from '../utils/fileUtils';

// Ensure the API key is available, otherwise throw an error.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const pollOperation = async <T,>(operation: any): Promise<T> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error) {
            console.error("Polling failed:", error);
            throw new Error("Failed while checking video generation status.");
        }
    }
    return currentOperation.response as T;
};

export const convertVideoToVR180 = async (videoFile: File, prompt: string): Promise<string> => {
    try {
        const { base64Data, mimeType } = await extractFrame(videoFile, 0.5); // Extract frame from 50% mark
        
        const imagePart = {
            imageBytes: base64Data,
            mimeType: mimeType,
        };

        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: imagePart,
            config: {
                numberOfVideos: 1,
            }
        });
        
        const result = await pollOperation<any>(operation);

        const downloadLink = result?.generatedVideos?.[0]?.video?.uri;
        
        if (!downloadLink) {
            console.error("No video URI found in the response:", result);
            throw new Error("AI model did not return a video link.");
        }
        
        // The URI requires the API key for access. We fetch the video data
        // and create a blob URL for safe playback in the browser.
        const videoUrlWithKey = `${downloadLink}&key=${process.env.API_KEY}`;
        const response = await fetch(videoUrlWithKey);

        if (!response.ok) {
            throw new Error(`Failed to download the generated video. Status: ${response.statusText}`);
        }

        const videoBlob = await response.blob();
        const objectUrl = URL.createObjectURL(videoBlob);
        return objectUrl;


    } catch (error) {
        console.error('Error generating video:', error);
        if (error instanceof Error) {
            throw new Error(`Video generation failed: ${error.message}`);
        }
        throw new Error('An unknown error occurred during video generation.');
    }
};