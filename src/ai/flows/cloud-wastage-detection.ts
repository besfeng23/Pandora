'use server';

/**
 * @fileOverview This file contains the Genkit flow for Cloud Wastage Detection.
 *
 * It identifies idle cloud resources and provides suggestions to optimize resource utilization, helping users reduce unnecessary cloud costs.
 * - cloudWastageDetection - A function that orchestrates the cloud wastage detection process.
 * - CloudWastageDetectionInput - The input type for the cloudWastageDetection function.
 * - CloudWastageDetectionOutput - The return type for the cloudWastageDetection function, providing insights and optimization suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CloudWastageDetectionInputSchema = z.object({
  cloudProvider: z.string().describe('The cloud provider (e.g., AWS, Azure, GCP).'),
  accountId: z.string().describe('The ID of the cloud account.'),
  region: z.string().describe('The region to analyze (e.g., us-west-2).'),
  resourceTypes: z
    .array(z.string())
    .describe('The types of cloud resources to analyze (e.g., EC2 instances, S3 buckets).'),
  costThreshold: z
    .number()
    .optional()
    .describe('The cost threshold above which resources are considered for optimization.'),
});
export type CloudWastageDetectionInput = z.infer<typeof CloudWastageDetectionInputSchema>;

const CloudWastageDetectionOutputSchema = z.object({
  idleResources: z
    .array(
      z.object({
        resourceId: z.string().describe('The ID of the idle resource.'),
        resourceType: z.string().describe('The type of the idle resource.'),
        estimatedWastedCost: z.number().describe('The estimated wasted cost for the resource.'),
        recommendation: z.string().describe('A suggestion to optimize the resource utilization.'),
        evidence: z.array(z.string()).describe('Links to metrics/events that provide evidence for the recommendation.'),
        relevanceScore: z.number().describe('A score indicating the relevance of the recommendation (0-1).'),
      })
    )
    .describe('A list of idle cloud resources and optimization suggestions.'),
});
export type CloudWastageDetectionOutput = z.infer<typeof CloudWastageDetectionOutputSchema>;

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
