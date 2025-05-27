import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. Please set it in your environment variables.');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: API_KEY,
  })],
  model: 'googleai/gemini-2.0-flash',
});
