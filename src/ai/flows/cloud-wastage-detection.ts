'use server';

/**
 * @fileOverview This file contains the Genkit flow for Cloud Wastage Detection.
 *
 * It identifies idle cloud resources and provides suggestions to optimize resource utilization, helping users reduce unnecessary cloud costs.
 * - cloudWastageDetection - A function that orchestrates the cloud wastage detection process.
 */

import {ai} from '@/ai/genkit';
import {
  type CloudWastageDetectionInput,
  CloudWastageDetectionInputSchema,
  type CloudWastageDetectionOutput,
  CloudWastageDetectionOutputSchema,
} from './types';

export async function cloudWastageDetection(input: CloudWastageDetectionInput): Promise<CloudWastageDetectionOutput> {
  return cloudWastageDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cloudWastageDetectionPrompt',
  input: {schema: CloudWastageDetectionInputSchema},
  output: {schema: CloudWastageDetectionOutputSchema},
  prompt: `You are an AI assistant that identifies idle cloud resources and provides suggestions to optimize resource utilization.

  Analyze the following cloud resources for potential cost savings:

  Cloud Provider: {{{cloudProvider}}}
  Account ID: {{{accountId}}}
  Region: {{{region}}}
  Resource Types: {{#each resourceTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Cost Threshold: {{{costThreshold}}}

  Based on the information provided, identify idle resources, estimate the wasted cost, and provide a recommendation for each resource.
  Include links to metrics/events that provide evidence for each recommendation.
  Assign a relevance score (0-1) to each recommendation.

  Format your response as a JSON object matching the CloudWastageDetectionOutputSchema schema. Be concise and specific in your recommendations.
  `,
});

const cloudWastageDetectionFlow = ai.defineFlow(
  {
    name: 'cloudWastageDetectionFlow',
    inputSchema: CloudWastageDetectionInputSchema,
    outputSchema: CloudWastageDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
