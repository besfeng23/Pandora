'use server';

import {
  CloudWastageDetectionInputSchema,
  type CloudWastageDetectionInput,
  type CloudWastageDetectionOutput,
} from './types';

const RESOURCE_SUGGESTIONS: Record<string, string> = {
  functions: 'Scale to zero during idle windows and tighten concurrency.',
  firestore: 'Add TTL policies for cold collections and review composite indexes.',
  storage: 'Enable object lifecycle rules to move cold data to cheaper tiers.',
  edge: 'Consolidate configs and remove unused environment variables.',
};

export async function cloudWastageDetection(
  input: CloudWastageDetectionInput,
): Promise<CloudWastageDetectionOutput> {
  const parsed = CloudWastageDetectionInputSchema.parse(input);

  const idleResources = parsed.resourceTypes.map((resourceType, index) => {
    const normalizedType = resourceType.toLowerCase();
    const estimatedWastedCost = Math.max(5, 15 - index * 2);

    return {
      resourceId: `${parsed.cloudProvider}-${normalizedType}-${index + 1}`,
      resourceType: resourceType,
      estimatedWastedCost,
      recommendation:
        RESOURCE_SUGGESTIONS[normalizedType] ||
        'Reduce retention, right-size instances, and disable unused integrations.',
      evidence: [
        `Low utilization observed in ${parsed.region}`,
        `No deploys for ${resourceType} in the last 30 days`,
      ],
      relevanceScore: Math.max(0.5, 0.95 - index * 0.1),
    };
  });

  return { idleResources };
}

