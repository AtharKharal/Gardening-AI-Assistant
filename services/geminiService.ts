
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: 'You are a friendly and knowledgeable gardening assistant.',
  },
});

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    const result: GenerateContentResponse = await chat.sendMessage(message);
    return result.text;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

export const analyzeImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Identify the plant in this photo and provide detailed care instructions. Structure the output in markdown with headings for Description, Light, Water, Soil, and Fertilizer.",
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze the image. Please try another one.");
  }
};
