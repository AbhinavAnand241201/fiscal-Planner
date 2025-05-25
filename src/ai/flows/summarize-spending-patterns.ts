// Summarizes a user's monthly spending patterns to provide a quick overview of where their money is going.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingPatternsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A detailed record of the user’s spending for the month, including categories, amounts, and dates.'
    ),
  userGoals: z
    .string()
    .describe(
      'The user’s financial goals, such as saving for a down payment or paying off debt.'
    ),
});
export type SummarizeSpendingPatternsInput =
  z.infer<typeof SummarizeSpendingPatternsInputSchema>;

const SummarizeSpendingPatternsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the user’s spending patterns for the month, highlighting key areas and trends.'
    ),
  recommendations: z
    .string()
    .describe(
      'Personalized recommendations based on the spending patterns and user goals, such as areas to cut back or invest more.'
    ),
});
export type SummarizeSpendingPatternsOutput =
  z.infer<typeof SummarizeSpendingPatternsOutputSchema>;

export async function summarizeSpendingPatterns(
  input: SummarizeSpendingPatternsInput
): Promise<SummarizeSpendingPatternsOutput> {
  return summarizeSpendingPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSpendingPatternsPrompt',
  input: {schema: SummarizeSpendingPatternsInputSchema},
  output: {schema: SummarizeSpendingPatternsOutputSchema},
  prompt: `You are a personal financial advisor. Summarize the user's spending patterns and provide personalized recommendations based on their spending data and financial goals.

Spending Data: {{{spendingData}}}
User Goals: {{{userGoals}}}

Summary:
Recommendations:`,
});

const summarizeSpendingPatternsFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingPatternsFlow',
    inputSchema: SummarizeSpendingPatternsInputSchema,
    outputSchema: SummarizeSpendingPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
