'use server';

import {
  GetToolArgumentsInputSchema,
  type GetToolArgumentsInput,
  type GetToolArgumentsOutput,
} from './types';

export async function getToolArguments(
  input: GetToolArgumentsInput,
): Promise<GetToolArgumentsOutput> {
  const parsed = GetToolArgumentsInputSchema.parse(input);

  try {
    const parsedPrompt = JSON.parse(parsed.prompt);
    return parsedPrompt;
  } catch {
    return {};
  }
}

