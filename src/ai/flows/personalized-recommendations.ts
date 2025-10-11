'use server';

/**
 * @fileOverview An AI agent that provides personalized recommendations to users based on their needs and preferences.
 *
 * - getPersonalizedRecommendations - A function that returns personalized recommendations.
 */

import {ai} from '@/ai/genkit';
import {
  type PersonalizedRecommendationsInput,
  PersonalizedRecommendationsInputSchema,
  type PersonalizedRecommendationsOutput,
  PersonalizedRecommendationsOutputSchema,
} from './types';

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI assistant that provides personalized recommendations to users based on their needs and preferences, and the current system state.\n\nUser Needs: {{{userNeeds}}}\nUser Preferences: {{{userPreferences}}}\nCurrent System State: {{{systemState}}}\n\nProvide a list of recommendations and the reasoning behind them.`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
