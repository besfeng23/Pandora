'use server';

/**
 * @fileOverview A natural language log query AI agent.
 *
 * - naturalLanguageLogQuery - A function that handles the natural language log query process.
 * - NaturalLanguageLogQueryInput - The input type for the naturalLanguageLogQuery function.
 * - NaturalLanguageLogQueryOutput - The return type for the naturalLanguageLogQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageLogQueryInputSchema = z.object({
  query: z.string().describe('The natural language query to use to search the logs.'),
  logs: z.string().describe('The logs to search through.'),
});
export type NaturalLanguageLogQueryInput = z.infer<typeof NaturalLanguageLogQueryInputSchema>;

const NaturalLanguageLogQueryOutputSchema = z.object({
  results: z.string().describe('The logs that match the query.'),
});
export type NaturalLanguageLogQueryOutput = z.infer<typeof NaturalLanguageLogQueryOutputSchema>;

export async function naturalLanguageLogQuery(input: NaturalLanguageLogQueryInput): Promise<NaturalLanguageLogQueryOutput> {
  return naturalLanguageLogQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageLogQueryPrompt',
  input: {schema: NaturalLanguageLogQueryInputSchema},
  output: {schema: NaturalLanguageLogQueryOutputSchema},
  prompt: `You are an expert log analyzer. You will be given a natural language query and a set of logs. You will return the logs that match the query.

Query: {{{query}}}
Logs: {{{logs}}}`,
});

const naturalLanguageLogQueryFlow = ai.defineFlow(
  {
    name: 'naturalLanguageLogQueryFlow',
    inputSchema: NaturalLanguageLogQueryInputSchema,
    outputSchema: NaturalLanguageLogQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
