'use server';

/**
 * @fileOverview Predictive maintenance flow using machine learning to predict equipment failures and schedule maintenance proactively.
 *
 * - predictEquipmentFailure - A function that predicts equipment failures and suggests proactive maintenance.
 * - PredictiveMaintenanceInput - The input type for the predictEquipmentFailure function.
 * - PredictiveMaintenanceOutput - The return type for the predictEquipmentFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveMaintenanceInputSchema = z.object({
  equipmentType: z.string().describe('Type of equipment being monitored.'),
  equipmentId: z.string().describe('Unique identifier for the equipment.'),
  historicalData: z.string().describe('Historical performance data of the equipment in JSON format.'),
  maintenanceLogs: z.string().describe('Maintenance logs for the equipment in JSON format.'),
});
export type PredictiveMaintenanceInput = z.infer<typeof PredictiveMaintenanceInputSchema>;

const PredictiveMaintenanceOutputSchema = z.object({
  failurePrediction: z.object({
    predictedFailure: z.boolean().describe('Whether or not a failure is predicted.'),
    failureProbability: z.number().describe('Probability of failure occurring (0-1).'),
    estimatedTimeToFailure: z.string().describe('Estimated time until failure.'),
    failureReason: z.string().describe('Reason for the predicted failure.'),
  }),
  maintenanceRecommendation: z.object({
    recommendedActions: z.array(z.string()).describe('List of recommended maintenance actions.'),
    priority: z.string().describe('Priority of the recommended maintenance (e.g., High, Medium, Low).'),
    justification: z.string().describe('Justification for the recommended maintenance.'),
  }),
});
export type PredictiveMaintenanceOutput = z.infer<typeof PredictiveMaintenanceOutputSchema>;

export async function predictEquipmentFailure(input: PredictiveMaintenanceInput): Promise<PredictiveMaintenanceOutput> {
  return predictiveMaintenanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveMaintenancePrompt',
  input: {schema: PredictiveMaintenanceInputSchema},
  output: {schema: PredictiveMaintenanceOutputSchema},
  prompt: `You are an expert in predictive maintenance using machine learning.

You will analyze the historical data and maintenance logs of a given piece of equipment to predict potential failures and recommend proactive maintenance actions.

Provide a failure prediction and a maintenance recommendation based on your analysis.

Consider the following:
Equipment Type: {{{equipmentType}}}
Equipment ID: {{{equipmentId}}}
Historical Data: {{{historicalData}}}
Maintenance Logs: {{{maintenanceLogs}}}

Output the failure prediction and maintenance recommendation in the following format:
{{outputSchema}}`,
});

const predictiveMaintenanceFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceFlow',
    inputSchema: PredictiveMaintenanceInputSchema,
    outputSchema: PredictiveMaintenanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
