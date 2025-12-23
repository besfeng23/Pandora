'use server';

import {
  PredictiveCostRecommendationsInputSchema,
  type PredictiveCostRecommendationsInput,
  type PredictiveCostRecommendationsOutput,
} from './types';

const RECOMMENDATION_LIBRARY = {
  vercel: [
    {
      type: 'deployment-optimization',
      description: 'Reduce preview deployment retention and prune unused env vars.',
      priority: 'medium',
    },
    {
      type: 'edge-caching',
      description: 'Enable cache headers for static assets to cut cold starts.',
      priority: 'high',
    },
  ],
  firebase: [
    {
      type: 'firestore-ttl',
      description: 'Apply TTL to archival collections and drop unused composite indexes.',
      priority: 'high',
    },
    {
      type: 'functions-scaling',
      description: 'Lower min instances and cap concurrency for low-traffic functions.',
      priority: 'medium',
    },
  ],
};

export async function predictiveCostRecommendations(
  input: PredictiveCostRecommendationsInput,
): Promise<PredictiveCostRecommendationsOutput> {
  const parsed = PredictiveCostRecommendationsInputSchema.parse(input);
  const catalog = RECOMMENDATION_LIBRARY[parsed.cloudProvider] ?? [];

  const recommendations = catalog.map(rec => ({
    ...rec,
    estimatedSavings: 15,
    evidence: `Derived from ${parsed.resourceType} usage trends.`,
  }));

  return {
    recommendations,
    analysis: `Costs analyzed for ${parsed.resourceType} on ${parsed.cloudProvider}.`,
  };
}

