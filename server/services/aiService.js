import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyADv17Fg2ED9jD4fWYfQJ7HpgiSojPFl3Q');

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { response };
  } catch (error) {
    console.error('AI Error:', error);
    return { response: { text: () => 'Sorry, AI is taking a break!' } };
  }
}

