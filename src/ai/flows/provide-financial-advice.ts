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
    .describe('The user\'s spending patterns, including categories and amounts.'),
  financialGoals: z.string().describe('The user\'s financial goals and objectives.'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

// Updated schema to remove visualization fields
const FinancialAdviceOutputSchema = z.object({
  summary: z.string().describe("A brief 2–3 sentence summary of the key findings."),
  spendingAnalysis: z.object({
    categories: z.array(z.object({
      category: z.string(),
      currentAmount: z.number(),
      recommendedAmount: z.number(),
      percentageChange: z.number(),
    })),
  }),
  actionSteps: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['High', 'Medium', 'Low']),
    timeline: z.string(),
  })),
  investmentPlan: z.object({
    shortTerm: z.array(z.object({
      type: z.string(),
      amount: z.number(),
      reason: z.string(),
    })),
    longTerm: z.array(z.object({
      type: z.string(),
      amount: z.number(),
      reason: z.string(),
    })),
  }),
  progressTracking: z.object({
    milestones: z.array(z.object({
      milestone: z.string(),
      targetDate: z.string(),
      targetAmount: z.number(),
      currentAmount: z.number(),
    })),
  }),
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
  name: "provideFinancialAdvicePrompt",
  input: { schema: FinancialAdviceInputSchema },
  output: { schema: FinancialAdviceOutputSchema },
  prompt: `You are a personal financial advisor specializing in structured, actionable financial planning. Analyze the user's spending patterns and goals to provide clear, concise advice.

Spending Patterns: {{{spendingPatterns}}}
Financial Goals: {{{financialGoals}}}

Generate a comprehensive financial plan that includes:

1. A brief summary (2–3 sentences) of key findings.
2. Spending analysis (current vs. recommended spending by category, with percentage change).
3. Prioritized action steps (with a step number, title, description, priority (High, Medium, Low), and timeline).
4. Investment plan (short-term and long-term investment suggestions, with type, amount, and reason).
5. Progress tracking (milestones, target date, target amount, and current amount).

Keep all text concise and actionable. Focus on specific numbers and clear steps.`,
});

const provideFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'provideFinancialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    try {
      console.log('Executing financial advice flow...');
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('No output received from AI model');
      }
      return output;
    } catch (error) {
      console.error('Error in provideFinancialAdviceFlow:', error);
      throw error;
    }
  }
);
