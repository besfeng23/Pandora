'use server';

import {
  AnomalyDetectionInputSchema,
  type AnomalyDetectionInput,
  type AnomalyDetectionOutput,
} from './types';

const ANOMALY_KEYWORDS = ['error', 'exception', 'timeout', 'failed', 'degraded'];

export async function detectAnomalies(
  input: AnomalyDetectionInput,
): Promise<AnomalyDetectionOutput> {
  const parsed = AnomalyDetectionInputSchema.parse(input);
  const haystack = `${parsed.systemLogs} ${parsed.systemMetrics}`.toLowerCase();
  const matched = ANOMALY_KEYWORDS.filter(word => haystack.includes(word));

  const isAnomalous = matched.length > 0;
  const anomalyDescription = isAnomalous
    ? `Detected signals: ${matched.join(', ')}`
    : 'No anomaly patterns detected in the provided metrics or logs.';

  return { isAnomalous, anomalyDescription };
}

