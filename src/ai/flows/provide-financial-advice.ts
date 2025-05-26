
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
  title: z.string().describe("A concise title for this section of advice."),
  points: z.array(z.string()).describe("A list of actionable advice points or tips, presented as individual strings.")
});

const FinancialAdviceOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, encouraging summary of the financial situation and potential."),
  actionableAdvice: z.array(AdviceSectionSchema).describe("Structured advice broken down into sections, each with a title and a list of specific points. For example, one section for budgeting, another for debt, another for savings."),
  investmentSuggestions: AdviceSectionSchema.optional().describe("A section with a title and list of general investment ideas or principles, if applicable. Keep it general, do not give specific stock advice."),
  keyTakeaways: z.array(z.string()).describe("A short list of 2-3 most important takeaways or quotes for the user to remember.")
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function provideFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return provideFinancialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFinancialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a friendly and insightful Personal Financial Advisor.
Your goal is to provide clear, actionable, and encouraging financial advice to the user.
Analyze the user's spending patterns and financial goals provided below.

Spending Patterns:
{{{spendingPatterns}}}

Financial Goals:
{{{financialGoals}}}

Please structure your response according to the output schema.
For 'actionableAdvice', create distinct sections for different themes (e.g., "Budgeting Strategies", "Debt Management", "Savings Boosters"). Each section should have a clear title and a list of specific, actionable points.
For 'investmentSuggestions', if relevant, provide general ideas or principles, not specific financial product recommendations.
For 'keyTakeaways', provide 2-3 concise and motivational points or short quotes.
Be positive and empowering in your tone.
Generate the output in the specified JSON format.
`,
});

const provideFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'provideFinancialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate advice. Please try again.");
    }
    // Ensure the output structure, particularly for arrays, even if AI returns null for optional fields
    return {
      overallSummary: output.overallSummary || "Could not generate a summary.",
      actionableAdvice: output.actionableAdvice || [],
      investmentSuggestions: output.investmentSuggestions, // Can be undefined as it's optional
      keyTakeaways: output.keyTakeaways || [],
    };
  }
);

