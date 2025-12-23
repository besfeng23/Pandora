'use server';

import {
  NaturalLanguageLogQueryInputSchema,
  type NaturalLanguageLogQueryInput,
  type NaturalLanguageLogQueryOutput,
} from './types';

export async function naturalLanguageLogQuery(
  input: NaturalLanguageLogQueryInput,
): Promise<NaturalLanguageLogQueryOutput> {
  const parsed = NaturalLanguageLogQueryInputSchema.parse(input);
  let parsedLogs: Array<Record<string, unknown>> = [];

  try {
    const candidate = JSON.parse(parsed.logs);
    parsedLogs = Array.isArray(candidate) ? candidate : candidate?.results || [];
  } catch (e) {
    parsedLogs = [];
  }

  const query = parsed.query.toLowerCase();
  const results = parsedLogs.filter(entry =>
    JSON.stringify(entry).toLowerCase().includes(query),
  );

  return { results: JSON.stringify(results) };
}

