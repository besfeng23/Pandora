'use server';

/**
 * @fileOverview This file defines a Genkit flow for anomaly detection in system behavior.
 *
 * The flow takes in system logs and metrics as input and uses an AI model to identify anomalous patterns.
 * It exports the AnomalyDetectionInput and AnomalyDetectionOutput types, as well as the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnomalyDetectionInputSchema = z.object({
  systemLogs: z.string().describe('System logs to analyze.'),
  systemMetrics: z.string().describe('System metrics data to analyze.'),
});

export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

const AnomalyDetectionOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether anomalous behavior is detected.'),
  anomalyDescription: z
    .string()
    .describe('A description of the detected anomaly, if any.'),
});

export type AnomalyDetectionOutput = z.infer<typeof AnomalyDetectionOutputSchema>;

export async function detectAnomalies(
  input: AnomalyDetectionInput
): Promise<AnomalyDetectionOutput> {
  return anomalyDetectionFlow(input);
}

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: {schema: AnomalyDetectionInputSchema},
  output: {schema: AnomalyDetectionOutputSchema},
  prompt: `You are an expert system administrator. Analyze the provided system logs and metrics to detect anomalous behavior. Return whether anomalous behavior is detected and a description of the anomaly, if any.\n\nSystem Logs: {{{systemLogs}}}\nSystem Metrics: {{{systemMetrics}}}`,
});

const anomalyDetectionFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: AnomalyDetectionInputSchema,
    outputSchema: AnomalyDetectionOutputSchema,
  },
  async input => {
    const {output} = await anomalyDetectionPrompt(input);
    return output!;
  }
);
