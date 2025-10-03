'use server';

/**
 * @fileOverview Implements a Genkit flow for predictive alerting, using machine learning to forecast alert firing based on trends.
 *
 * - predictAlert - Predicts when an alert is likely to fire based on current trends.
 * - PredictiveAlertInput - The input type for the predictAlert function.
 * - PredictiveAlertOutput - The return type for the predictAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveAlertInputSchema = z.object({
  metricName: z.string().describe('The name of the metric to predict alerts for.'),
  currentValue: z.number().describe('The current value of the metric.'),
  trendData: z
    .array(z.number())
    .describe(
      'An array of historical data points for the metric, representing the trend.'
    ),
  threshold: z
    .number()
    .describe('The threshold value that triggers the alert.'),
  timeWindow: z
    .string()
    .describe(
      'The time window over which the trend data is collected, e.g., "1 hour", "1 day".'
    ),
});
export type PredictiveAlertInput = z.infer<typeof PredictiveAlertInputSchema>;

const PredictiveAlertOutputSchema = z.object({
  predictedFiringTime: z
    .string()
    .describe(
      'An ISO timestamp string indicating the predicted time the alert will fire, or null if it is not predicted to fire within the observable window.'
    )
    .nullable(),
  confidenceLevel: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level of the prediction.'
    ),
  suggestedThresholdAdjustment: z
    .number()
    .describe(
      'A suggested adjustment to the threshold value to prevent false positives or missed alerts.'
    ),
  explanation: z
    .string()
    .describe(
      'An explanation of why the alert is predicted to fire and the reasoning behind the suggested threshold adjustment.'
    ),
});
export type PredictiveAlertOutput = z.infer<typeof PredictiveAlertOutputSchema>;

export async function predictAlert(input: PredictiveAlertInput): Promise<PredictiveAlertOutput> {
  return predictiveAlertFlow(input);
}

const predictiveAlertPrompt = ai.definePrompt({
  name: 'predictiveAlertPrompt',
  input: {schema: PredictiveAlertInputSchema},
  output: {schema: PredictiveAlertOutputSchema},
  prompt: `You are an AI-powered alerting system that predicts when an alert is likely to fire based on current trends.

  Metric Name: {{{metricName}}}
  Current Value: {{{currentValue}}}
  Trend Data: {{{trendData}}}
  Threshold: {{{threshold}}}
  Time Window: {{{timeWindow}}}

  Analyze the trend data and the current value to predict if and when the metric will cross the threshold.
  Provide a confidence level for your prediction (0 to 1).
  Suggest a threshold adjustment to prevent false positives or missed alerts, if necessary.
  Explain your reasoning for the prediction and the suggested adjustment.

  Ensure that the predictedFiringTime is an ISO timestamp string.

  If the alert is not predicted to fire within the observable window, set predictedFiringTime to null.
  `,
});

const predictiveAlertFlow = ai.defineFlow(
  {
    name: 'predictiveAlertFlow',
    inputSchema: PredictiveAlertInputSchema,
    outputSchema: PredictiveAlertOutputSchema,
  },
  async input => {
    const {output} = await predictiveAlertPrompt(input);
    return output!;
  }
);
