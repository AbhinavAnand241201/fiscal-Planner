
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

const FinancialAdviceOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, encouraging summary of the financial situation and potential. Keep it concise and motivational."),
  actionableAdvice: z.array(AdviceSectionSchema).describe("Structured advice broken down into sections. Each section should have a clear, engaging title and a list of specific points (formatted as steps or short bullets)."),
  investmentSuggestions: AdviceSectionSchema.optional().describe("A section with a title and list of general investment ideas or principles, if applicable. Keep it general, do not give specific stock advice. Use short points."),
  keyTakeaways: z.array(z.string()).describe("A short list of 2-3 most important takeaways or motivational quotes for the user to remember. Each takeaway should be concise.")
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function provideFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return provideFinancialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFinancialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a friendly, insightful, and highly engaging Personal Financial Advisor.
Your goal is to provide clear, actionable, and encouraging financial advice that is easy to understand and act upon.
Analyze the user's spending patterns and financial goals provided below.

Spending Patterns:
{{{spendingPatterns}}}

Financial Goals:
{{{financialGoals}}}

IMPORTANT INSTRUCTIONS FOR YOUR RESPONSE:
- Structure your response STRICTLY according to the output schema.
- For 'overallSummary', provide a brief, positive, and motivational overview.
- For 'actionableAdvice':
    - Create distinct sections for different themes (e.g., "Budgeting Breakthroughs", "Debt Demolition Plan", "Savings Supercharge").
    - Each section MUST have an engaging 'title'.
    - For 'points' within each section:
        - Present advice as a series of SHORT, distinct bullet points or NUMBERED STEPS.
        - AVOID long paragraphs. Each point should be easily digestible.
        - If a section involves a process, break it into clear, sequential steps (e.g., "1. Step one description. 2. Step two description.").
        - Consider starting a section or a point with an impactful (but brief) quote or a strong statement if it makes the advice more engaging.
- For 'investmentSuggestions' (if relevant):
    - Provide general ideas or principles, NOT specific financial product recommendations.
    - Use short, easy-to-understand points.
- For 'keyTakeaways':
    - List 2-3 concise and motivational key messages or short, memorable quotes.
- Your tone should be positive, empowering, and clear. Imagine you're guiding a friend.
- DO NOT use complex financial jargon without simple explanations.
- Ensure the output is in the specified JSON format.
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
