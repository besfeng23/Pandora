'use server';

/**
 * @fileOverview Implements a Genkit flow for predictive alerting, using machine learning to forecast alert firing based on trends.
 *
 * - predictAlert - Predicts when an alert is likely to fire based on current trends.
 */

import {ai} from '@/ai/genkit';
import {
  type PredictiveAlertInput,
  PredictiveAlertInputSchema,
  type PredictiveAlertOutput,
  PredictiveAlertOutputSchema,
} from './types';

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
