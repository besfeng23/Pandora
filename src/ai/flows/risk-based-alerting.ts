'use server';

import {
  RiskBasedAlertingInputSchema,
  type RiskBasedAlertingInput,
  type RiskBasedAlertingOutput,
} from './types';

export async function riskBasedAlerting(
  input: RiskBasedAlertingInput,
): Promise<RiskBasedAlertingOutput> {
  const parsed = RiskBasedAlertingInputSchema.parse(input);

  const impactScore = ['low', 'medium', 'high'].indexOf(parsed.potentialImpact.toLowerCase());
  const likelihoodScore = ['low', 'medium', 'high'].indexOf(
    parsed.likelihoodOfOccurrence.toLowerCase(),
  );

  const priorityScore = Math.max(0, (impactScore + likelihoodScore) * 10);
  const rationale = `Impact=${parsed.potentialImpact}; Likelihood=${parsed.likelihoodOfOccurrence}.`;

  return { priorityScore, rationale };
}

