
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are Lumi, a cute, friendly, and empathetic emotional wellbeing companion. 
Your goal is to listen to the user, provide emotional support, and suggest gentle wellbeing exercises. 
Keep your tone warm, supportive, and occasionally professional when giving specific advice like breathing techniques.
Avoid clinical diagnoses. Focus on validation and comfort.
When responding to a journal entry, summarize the emotions and offer a reflective prompt.`;

export const getLumiResponse = async (history: Message[], userInput: string) => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    }
  });

  const response = await model;
  return response.text || "I'm here for you. Could you tell me more?";
};

export const analyzeFacialEmotion = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "Analyze the facial expression of the person in this image. Identify their primary emotional state (e.g., Happy, Sad, Stressed, Fatigued, Neutral) and provide one short, gentle wellbeing suggestion (breathing, affirmation, or physical stretch). Return the result as a JSON object with keys: 'emotion', 'confidence' (0-1), and 'suggestion'."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emotion: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          suggestion: { type: Type.STRING }
        },
        required: ["emotion", "confidence", "suggestion"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
};
