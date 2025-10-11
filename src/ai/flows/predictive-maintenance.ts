'use server';

/**
 * @fileOverview Predictive maintenance flow using machine learning to predict equipment failures and schedule maintenance proactively.
 *
 * - predictEquipmentFailure - A function that predicts equipment failures and suggests proactive maintenance.
 */

import {ai} from '@/ai/genkit';
import {
  type PredictiveMaintenanceInput,
  PredictiveMaintenanceInputSchema,
  type PredictiveMaintenanceOutput,
  PredictiveMaintenanceOutputSchema,
} from './types';

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
