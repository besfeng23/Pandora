'use server';

/**
 * @fileOverview An AI-driven code review flow that automatically flags potential security and performance issues.
 *
 * - automatedCodeReview - A function that handles the code review process.
 */

import {ai} from '@/ai/genkit';
import {
  type AutomatedCodeReviewInput,
  AutomatedCodeReviewInputSchema,
  type AutomatedCodeReviewOutput,
  AutomatedCodeReviewOutputSchema,
} from './types';

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
