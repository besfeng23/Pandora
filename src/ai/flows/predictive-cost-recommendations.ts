'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven recommendations for optimizing cloud costs.
 *
 * - predictiveCostRecommendations - A function that triggers the cost optimization recommendation flow.
 */

import {ai} from '@/ai/genkit';
import {
  type PredictiveCostRecommendationsInput,
  PredictiveCostRecommendationsInputSchema,
  type PredictiveCostRecommendationsOutput,
  PredictiveCostRecommendationsOutputSchema,
} from './types';

export async function predictiveCostRecommendations(input: PredictiveCostRecommendationsInput): Promise<PredictiveCostRecommendationsOutput> {
  return predictiveCostRecommendationsFlow(input);
}

const predictiveCostRecommendationsPrompt = ai.definePrompt({
  name: 'predictiveCostRecommendationsPrompt',
  input: {schema: PredictiveCostRecommendationsInputSchema},
  output: {schema: PredictiveCostRecommendationsOutputSchema},
  prompt: `You are an AI cloud cost optimization expert. Analyze the provided cloud resource usage and cost data, along with the current configuration, and provide actionable recommendations for reducing costs.

Cloud Provider: {{{cloudProvider}}}
Resource Type: {{{resourceType}}}
Usage Data: {{{usageData}}}
Cost Data: {{{costData}}}
Current Configuration: {{{currentConfiguration}}}

Analyze the data and provide the following:
1.  A list of cost optimization recommendations, including the type of recommendation, a detailed description, the estimated cost savings per month, and the priority.
2.  A detailed analysis of the cloud cost data, explaining the reasoning behind the recommendations.

Ensure that the recommendations are relevant to the specific cloud provider and resource type.

Format the output as a JSON object conforming to the PredictiveCostRecommendationsOutputSchema schema.
`,
});

const predictiveCostRecommendationsFlow = ai.defineFlow(
  {
    name: 'predictiveCostRecommendationsFlow',
    inputSchema: PredictiveCostRecommendationsInputSchema,
    outputSchema: PredictiveCostRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await predictiveCostRecommendationsPrompt(input);
    return output!;
  }
);
