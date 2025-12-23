'use server';

import {
  PredictiveMaintenanceInputSchema,
  type PredictiveMaintenanceInput,
  type PredictiveMaintenanceOutput,
} from './types';

export async function predictEquipmentFailure(
  input: PredictiveMaintenanceInput,
): Promise<PredictiveMaintenanceOutput> {
  const parsed = PredictiveMaintenanceInputSchema.parse(input);
  const hasWarning = /error|fail|degraded/i.test(parsed.historicalData + parsed.maintenanceLogs);

  return {
    failurePrediction: {
      predictedFailure: hasWarning,
      failureProbability: hasWarning ? 0.42 : 0.12,
      estimatedTimeToFailure: hasWarning ? 'PT48H' : 'PT240H',
      failureReason: hasWarning
        ? 'Recent logs show repeated degradation patterns.'
        : 'No degradation trends detected.',
    },
    maintenanceRecommendation: {
      recommendedActions: hasWarning
        ? ['Schedule inspection', 'Increase monitoring frequency', 'Run diagnostics']
        : ['Continue standard maintenance cadence'],
      priority: hasWarning ? 'High' : 'Low',
      justification: hasWarning
        ? 'Detected repeated error signatures in historical data.'
        : 'No anomalies detected in recent history.',
    },
  };
}

