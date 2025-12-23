'use server';

import {
  PersonalizedRecommendationsInputSchema,
  type PersonalizedRecommendationsInput,
  type PersonalizedRecommendationsOutput,
} from './types';

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput,
): Promise<PersonalizedRecommendationsOutput> {
  const parsed = PersonalizedRecommendationsInputSchema.parse(input);
  const recommendations = [
    `Prioritize actions that meet the stated needs: ${parsed.userNeeds}.`,
    `Respect preferences: ${parsed.userPreferences}.`,
    `Align with current system state: ${parsed.systemState}.`,
  ];

  return {
    recommendations,
    reasoning:
      'Generated deterministically from provided needs, preferences, and system state (no external model calls).',
  };
}

