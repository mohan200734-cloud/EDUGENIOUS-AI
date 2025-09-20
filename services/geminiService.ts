
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const educationalSystemInstruction = `You are an expert educational assistant. Your primary function is to provide clear, accurate, and detailed explanations or quizzes based on the provided text.
You MUST ONLY respond to content that is educational in nature (e.g., science, history, literature, mathematics, technology).
If the provided text or the implied request is not related to an educational topic (e.g., asking for financial advice, generating harmful content, celebrity gossip), you MUST politely decline and state: 'I can only assist with educational content. Please provide a document related to a learning topic.'`;

const DISCLAIMER_TEXT = 'I can only assist with educational content. Please provide a document related to a learning topic.';

export const explainConcept = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following text, provide a detailed but easy-to-understand explanation of the core concepts. Format the output for readability. Text: "${text}"`,
            config: {
                systemInstruction: educationalSystemInstruction,
            },
        });
        
        const resultText = response.text.trim();
        if(resultText.includes("I can only assist with educational content")) {
            return DISCLAIMER_TEXT;
        }

        return resultText;
    } catch (error) {
        console.error("Error in explainConcept:", error);
        throw new Error("Failed to generate explanation from AI model.");
    }
};

export const generateQuiz = async (text: string): Promise<Quiz> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following text, generate an engaging multiple-choice quiz with exactly 5 questions. Each question must have 4 options. Identify the correct answer and provide a brief explanation for why it's correct. Text: "${text}"`,
            config: {
                systemInstruction: educationalSystemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                            },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                        },
                        required: ["question", "options", "correctAnswer", "explanation"],
                    },
                },
            },
        });

        // The API might return the disclaimer as plain text instead of JSON
        const resultText = response.text.trim();
        if (resultText.startsWith('{') || resultText.startsWith('[')) {
            return JSON.parse(resultText) as Quiz;
        } else {
             // If we get a disclaimer, we wrap it in an error to be caught by the UI
            throw new Error(DISCLAIMER_TEXT);
        }

    } catch (error) {
        console.error("Error in generateQuiz:", error);
        if (error instanceof Error && error.message.includes(DISCLAIMER_TEXT)) {
            throw error;
        }
        throw new Error("Failed to generate quiz from AI model.");
    }
};
