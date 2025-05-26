import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const API_KEY = 'AIzaSyAi8iVINkwuOtBhoGn1kmEaK49r9VD0Dj8';

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. Please set it in your environment variables.');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: API_KEY,
  })],
  model: 'googleai/gemini-2.0-flash',
});
