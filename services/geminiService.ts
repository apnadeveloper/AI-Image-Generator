import { GoogleGenAI } from "@google/genai";

// Initialize the client with the environment API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Imagen 3 model (imagen-4.0-generate-001).
 * @param prompt The text description of the image to generate.
 * @param aspectRatio The desired aspect ratio (e.g., "1:1", "16:9").
 * @returns A promise that resolves to the base64 image data URL.
 */
export const generateImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) {
      throw new Error("No image generated.");
    }
    return `data:image/jpeg;base64,${imageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Edits an image using the Gemini 2.5 Flash Image model (Nano Banana).
 * @param imageBase64 The base64 encoded string of the source image (raw bytes, no prefix).
 * @param imageMimeType The MIME type of the source image.
 * @param prompt The instruction for how to modify the image.
 * @returns A promise that resolves to the base64 image data URL of the result.
 */
export const editImage = async (imageBase64: string, imageMimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: imageMimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image returned from edit operation.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};