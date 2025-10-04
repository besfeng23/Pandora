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
  logs: z.string().describe('The logs to search through in JSON format.'),
});
export type NaturalLanguageLogQueryInput = z.infer<typeof NaturalLanguageLogQueryInputSchema>;

const NaturalLanguageLogQueryOutputSchema = z.object({
  results: z.string().describe('The logs that match the query, returned as a JSON string of an array of log objects.'),
});
export type NaturalLanguageLogQueryOutput = z.infer<typeof NaturalLanguageLogQueryOutputSchema>;

export async function naturalLanguageLogQuery(input: NaturalLanguageLogQueryInput): Promise<NaturalLanguageLogQueryOutput> {
  return naturalLanguageLogQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageLogQueryPrompt',
  input: {schema: NaturalLanguageLogQueryInputSchema},
  output: {schema: NaturalLanguageLogQueryOutputSchema},
  prompt: `You are an expert log analyzer. You will be given a natural language query and a set of logs in JSON format. You will return the logs that match the query.
The log objects have the following shape:
type AuditEvent = {
  id: string;
  ts: string;
  env: 'dev'|'stg'|'prod';
  service: string;
  tool: string;
  action: string;
  actor: { id: string; type: 'user'|'service'|'automation'; email?: string; name?: string };
  source: 'UI'|'API'|'CLI'|'Automation';
  resource?: { type: string; id: string; name?: string; path?: string };
  session?: string;
  severity: 'info'|'warn'|'error'|'critical';
  result: 'success'|'fail';
  latency_ms?: number;
  cost_usd?: number;
  policy?: { rbac?: 'allow'|'deny'; spend_cap?: 'ok'|'blocked'; maintenance?: 'window'|'none' };
  network?: { ip?: string; ua?: string; region?: string };
  tags?: string[];
  diff?: { before?: unknown; after?: unknown };
  integrity: { signed: boolean; signer?: string; sig?: string; hash: string; prev_hash?: string; merkle_root?: string };
  raw: unknown;
};

Your response must be a JSON object with a single key "results" which contains a JSON string of the array of matching log objects. Do not include any other text or explanation.

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
