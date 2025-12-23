'use server';

import {
  PredictiveAlertInputSchema,
  type PredictiveAlertInput,
  type PredictiveAlertOutput,
} from './types';

export async function predictAlert(
  input: PredictiveAlertInput,
): Promise<PredictiveAlertOutput> {
  const parsed = PredictiveAlertInputSchema.parse(input);
  const { currentValue, threshold, trendData } = parsed;

  const recentAverage =
    trendData.length > 0
      ? trendData.reduce((acc, v) => acc + v, 0) / trendData.length
      : currentValue;

  const predictedFiringTime =
    currentValue >= threshold || recentAverage >= threshold
      ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
      : null;

  const confidenceLevel = Math.min(
    1,
    Math.max(0.3, Math.abs(currentValue - threshold) / (threshold || 1)),
  );

  return {
    predictedFiringTime,
    confidenceLevel,
    suggestedThresholdAdjustment:
      currentValue > threshold ? threshold * 1.05 : threshold * 0.95,
    explanation: `Current=${currentValue}, avg=${recentAverage}, threshold=${threshold}.`,
  };
}

