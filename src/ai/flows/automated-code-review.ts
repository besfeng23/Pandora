'use server';

/**
 * @fileOverview An AI-driven code review flow that automatically flags potential security and performance issues.
 *
 * - automatedCodeReview - A function that handles the code review process.
 * - AutomatedCodeReviewInput - The input type for the automatedCodeReview function.
 * - AutomatedCodeReviewOutput - The return type for the automatedCodeReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedCodeReviewInputSchema = z.object({
  code: z.string().describe('The code to be reviewed.'),
  language: z.string().describe('The programming language of the code.'),
  securityBestPractices: z
    .string()
    .optional()
    .describe('Security best practices to consider during the review.'),
  performanceBestPractices: z
    .string()
    .optional()
    .describe('Performance best practices to consider during the review.'),
});
export type AutomatedCodeReviewInput = z.infer<typeof AutomatedCodeReviewInputSchema>;

const AutomatedCodeReviewOutputSchema = z.object({
  securityIssues: z
    .array(z.string())
    .describe('A list of potential security issues found in the code.'),
  performanceIssues: z
    .array(z.string())
    .describe('A list of potential performance issues found in the code.'),
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to improve the code.'),
});
export type AutomatedCodeReviewOutput = z.infer<typeof AutomatedCodeReviewOutputSchema>;

export async function automatedCodeReview(input: AutomatedCodeReviewInput): Promise<AutomatedCodeReviewOutput> {
  return automatedCodeReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedCodeReviewPrompt',
  input: {schema: AutomatedCodeReviewInputSchema},
  output: {schema: AutomatedCodeReviewOutputSchema},
  prompt: `You are an AI-powered code reviewer that automatically flags potential security and performance issues in the given code.\n\nAnalyze the following code and identify any security and performance issues. Also, provide suggestions to improve the code.\n\nProgramming Language: {{{language}}}\n\nCode:\n{{code}}\n\nSecurity Best Practices (Optional): {{{securityBestPractices}}}\n\nPerformance Best Practices (Optional): {{{performanceBestPractices}}}\n\nOutput the security issues, performance issues, and suggestions as a JSON object. Make sure to include the schema descriptions in the response.`,
});

const automatedCodeReviewFlow = ai.defineFlow(
  {
    name: 'automatedCodeReviewFlow',
    inputSchema: AutomatedCodeReviewInputSchema,
    outputSchema: AutomatedCodeReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
