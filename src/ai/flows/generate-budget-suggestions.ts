'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized budget suggestions.
 *
 * - generateBudgetSuggestions - A function that generates budget suggestions based on user spending history and financial goals.
 * - GenerateBudgetSuggestionsInput - The input type for the generateBudgetSuggestions function.
 * - GenerateBudgetSuggestionsOutput - The return type for the generateBudgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBudgetSuggestionsInputSchema = z.object({
  spendingHistory: z
    .string()
    .describe(
      'A detailed history of the user spending, including categories and amounts.'
    ),
  financialGoals: z
    .string()
    .describe('The financial goals of the user, such as saving for a house or paying off debt.'),
  currentBudget: z
    .string()
    .describe('The user current budget, including categories and amounts.'),
});
export type GenerateBudgetSuggestionsInput = z.infer<
  typeof GenerateBudgetSuggestionsInputSchema
>;

const GenerateBudgetSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggested budget adjustments, with explanations for each suggestion.'
    ),
});
export type GenerateBudgetSuggestionsOutput = z.infer<
  typeof GenerateBudgetSuggestionsOutputSchema
>;

export async function generateBudgetSuggestions(
  input: GenerateBudgetSuggestionsInput
): Promise<GenerateBudgetSuggestionsOutput> {
  return generateBudgetSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBudgetSuggestionsPrompt',
  input: {schema: GenerateBudgetSuggestionsInputSchema},
  output: {schema: GenerateBudgetSuggestionsOutputSchema},
  prompt: `You are a personal financial advisor. Given the user's spending history, financial goals, and current budget, suggest personalized budget adjustments to help them optimize their budget effectively.

Spending History: {{{spendingHistory}}}

Financial Goals: {{{financialGoals}}}

Current Budget: {{{currentBudget}}}

Suggestions:`,
});

const generateBudgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateBudgetSuggestionsFlow',
    inputSchema: GenerateBudgetSuggestionsInputSchema,
    outputSchema: GenerateBudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
