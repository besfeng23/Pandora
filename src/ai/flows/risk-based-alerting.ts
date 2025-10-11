'use server';

/**
 * @fileOverview A flow that prioritizes alerts based on their potential impact and likelihood of occurrence.
 *
 * - getRiskBasedAlertPrioritization - A function that handles the alert prioritization process.
 */

import {ai} from '@/ai/genkit';
import {
  type RiskBasedAlertingInput,
  RiskBasedAlertingInputSchema,
  type RiskBasedAlertingOutput,
  RiskBasedAlertingOutputSchema,
} from './types';

export async function getRiskBasedAlertPrioritization(input: RiskBasedAlertingInput): Promise<RiskBasedAlertingOutput> {
  return riskBasedAlertingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskBasedAlertingPrompt',
  input: {schema: RiskBasedAlertingInputSchema},
  output: {schema: RiskBasedAlertingOutputSchema},
  prompt: `You are an expert system administrator responsible for prioritizing alerts based on their potential impact and likelihood of occurrence.

  Given the following information about an alert, determine a priority score (a number between 1 and 100, where 100 is the highest priority) and provide a rationale for your decision.

  Alert Description: {{{alertDescription}}}
  Potential Impact: {{{potentialImpact}}}
  Likelihood of Occurrence: {{{likelihoodOfOccurrence}}}

  Consider both the potential impact and the likelihood of occurrence when assigning the priority score. An alert with a high potential impact and a high likelihood of occurrence should receive a higher priority score than an alert with a low potential impact and a low likelihood of occurrence.

  Return the priority score and rationale in the following JSON format:
  {
    "priorityScore": <priority_score>,
    "rationale": "<rationale>"
  }`,
});

const riskBasedAlertingFlow = ai.defineFlow(
  {
    name: 'riskBasedAlertingFlow',
    inputSchema: RiskBasedAlertingInputSchema,
    outputSchema: RiskBasedAlertingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
