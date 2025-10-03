'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven recommendations for optimizing cloud costs.
 *
 * - predictiveCostRecommendations - A function that triggers the cost optimization recommendation flow.
 * - PredictiveCostRecommendationsInput - The input type for the predictiveCostRecommendations function.
 * - PredictiveCostRecommendationsOutput - The return type for the predictiveCostRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveCostRecommendationsInputSchema = z.object({
  cloudProvider: z.string().describe('The cloud provider (e.g., AWS, Azure, GCP).'),
  resourceType: z.string().describe('The type of cloud resource (e.g., EC2 instance, Azure VM, Google Compute Engine).'),
  usageData: z.string().describe('JSON string containing historical usage data for the resource.'),
  costData: z.string().describe('JSON string containing historical cost data for the resource.'),
  currentConfiguration: z.string().describe('JSON string containing current configuration details of the resource.'),
});
export type PredictiveCostRecommendationsInput = z.infer<typeof PredictiveCostRecommendationsInputSchema>;

const PredictiveCostRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      type: z.string().describe('The type of recommendation (e.g., instance resizing, reserved instance purchase).'),
      description: z.string().describe('A detailed description of the recommendation.'),
      estimatedSavings: z.number().describe('The estimated cost savings per month.'),
      priority: z.enum(['high', 'medium', 'low']).describe('The priority of the recommendation.'),
      evidence: z.string().optional().describe('Links to evidence supporting the recommendation.'),
    })
  ).describe('A list of cost optimization recommendations.'),
  analysis: z.string().describe('AI analysis of the cloud cost data.'),
});
export type PredictiveCostRecommendationsOutput = z.infer<typeof PredictiveCostRecommendationsOutputSchema>;

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
