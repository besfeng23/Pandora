'use server';

/**
 * @fileOverview A flow that prioritizes alerts based on their potential impact and likelihood of occurrence.
 *
 * - getRiskBasedAlertPrioritization - A function that handles the alert prioritization process.
 * - RiskBasedAlertingInput - The input type for the getRiskBasedAlertPrioritization function.
 * - RiskBasedAlertingOutput - The return type for the getRiskBasedAlertPrioritization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskBasedAlertingInputSchema = z.object({
  alertDescription: z.string().describe('A description of the alert.'),
  potentialImpact: z.string().describe('The potential impact of the alert (e.g., high, medium, low).'),
  likelihoodOfOccurrence: z.string().describe('The likelihood of the alert occurring (e.g., high, medium, low).'),
});
export type RiskBasedAlertingInput = z.infer<typeof RiskBasedAlertingInputSchema>;

const RiskBasedAlertingOutputSchema = z.object({
  priorityScore: z.number().describe('A numerical score representing the priority of the alert.'),
  rationale: z.string().describe('The rationale behind the assigned priority score.'),
});
export type RiskBasedAlertingOutput = z.infer<typeof RiskBasedAlertingOutputSchema>;

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
