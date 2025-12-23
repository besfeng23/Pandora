'use server';

import {
  RootCauseAnalysisInputSchema,
  type RootCauseAnalysisInput,
  type RootCauseAnalysisOutput,
} from './types';

export async function performRootCauseAnalysis(
  input: RootCauseAnalysisInput,
): Promise<RootCauseAnalysisOutput> {
  const parsed = RootCauseAnalysisInputSchema.parse(input);
  const summary = parsed.incidentDescription.slice(0, 180);

  return {
    potentialRootCause: `Based on the description, the likely root cause is configuration drift or a recent deploy side-effect: "${summary}".`,
    supportingEvidence:
      'Review the latest Vercel deployment, Firebase rules changes, and recent feature flags for regressions.',
  };
}

export { performRootCauseAnalysis as rootCauseAnalysis };

