'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing AI-driven root cause analysis of incidents.
 *
 * The flow takes an incident description as input and returns a potential root cause.
 *
 * @file RootCauseAnalysisFlow - A function that performs root cause analysis.
 * @file RootCauseAnalysisInput - The input type for the RootCauseAnalysisFlow function.
 * @file RootCauseAnalysisOutput - The return type for the RootCauseAnalysisFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RootCauseAnalysisInputSchema = z.object({
  incidentDescription: z
    .string()
    .describe('A detailed description of the incident, including symptoms, affected systems, and any relevant logs or metrics.'),
});
export type RootCauseAnalysisInput = z.infer<typeof RootCauseAnalysisInputSchema>;

const RootCauseAnalysisOutputSchema = z.object({
  potentialRootCause: z
    .string()
    .describe('A concise explanation of the most likely root cause of the incident.'),
  supportingEvidence: z
    .string()
    .optional()
    .describe('Optional: Any specific logs, metrics, or events that support the identified root cause.'),
});
export type RootCauseAnalysisOutput = z.infer<typeof RootCauseAnalysisOutputSchema>;

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
