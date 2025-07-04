
'use server';

/**
 * @fileOverview A financial advice AI agent.
 *
 * - provideFinancialAdvice - A function that provides personalized financial advice.
 * - FinancialAdviceInput - The input type for the provideFinancialAdvice function.
 * - FinancialAdviceOutput - The return type for the provideFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAdviceInputSchema = z.object({
  spendingPatterns: z
    .string()
    .describe('The user\'s spending patterns, including categories and amounts. Example: "Groceries: $400, Dining Out: $200, Subscriptions: $50, Rent: $1000"'),
  financialGoals: z.string().describe('The user\'s financial goals and objectives. Example: "Save for a house down payment, pay off $5000 in credit card debt, build a 3-month emergency fund."'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const AdviceSectionSchema = z.object({
  title: z.string().describe("A concise title for this section of advice. Make it engaging!"),
  points: z.array(z.string()).describe("A list of actionable advice points. Present these as short, distinct bullet points or numbered steps. Avoid long paragraphs. Start with an impactful statement or quote if relevant.")
});

// Updated schema to remove visualization fields
const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice based on spending and goals.'),
  investmentSuggestions: z.string().describe('Suggestions for investments.'),
  budgetingTips: z.string().describe('Tips for improving the user\'s budget.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function provideFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  try {
    console.log('Starting financial advice generation...');
    const result = await provideFinancialAdviceFlow(input);
    console.log('Financial advice generated successfully');
    return result;
  } catch (error) {
    console.error('Error in provideFinancialAdvice:', error);
    throw new Error('Failed to generate financial advice. Please try again later.');
  }
}

const prompt = ai.definePrompt({
  name: 'provideFinancialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a personal financial advisor. Analyze the user's spending patterns and goals to provide personalized financial advice, investment suggestions, and budgeting tips.

Spending Patterns: {{{spendingPatterns}}}
Financial Goals: {{{financialGoals}}}

Provide clear, actionable advice to help the user make informed financial decisions.`,
});

const provideFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'provideFinancialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
