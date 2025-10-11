'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing AI-driven root cause analysis of incidents.
 *
 * The flow takes an incident description as input and returns a potential root cause.
 *
 * @file RootCauseAnalysisFlow - A function that performs root cause analysis.
 */

import {ai} from '@/ai/genkit';
import {
  type RootCauseAnalysisInput,
  RootCauseAnalysisInputSchema,
  type RootCauseAnalysisOutput,
  RootCauseAnalysisOutputSchema,
} from './types';

export async function performRootCauseAnalysis(
  input: RootCauseAnalysisInput
): Promise<RootCauseAnalysisOutput> {
  return rootCauseAnalysisFlow(input);
}

const rootCauseAnalysisPrompt = ai.definePrompt({
  name: 'rootCauseAnalysisPrompt',
  input: {schema: RootCauseAnalysisInputSchema},
  output: {schema: RootCauseAnalysisOutputSchema},
  prompt: `You are an expert system administrator specializing in root cause analysis.

  Given the following incident description, identify the most likely root cause and provide supporting evidence if available.

  Incident Description: {{{incidentDescription}}}

  Format your response as follows:

  Potential Root Cause: [Explanation of the root cause]
  Supporting Evidence: [Optional: Specific logs, metrics, or events that support the root cause]
  `,
});

const rootCauseAnalysisFlow = ai.defineFlow(
  {
    name: 'rootCauseAnalysisFlow',
    inputSchema: RootCauseAnalysisInputSchema,
    outputSchema: RootCauseAnalysisOutputSchema,
  },
  async input => {
    const {output} = await rootCauseAnalysisPrompt(input);
    return output!;
  }
);
