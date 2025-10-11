'use server';

/**
 * @fileOverview An AI agent that extracts structured tool arguments from a natural language prompt.
 *
 * - getToolArguments - A function that returns structured arguments for a given tool and prompt.
 */

import {ai} from '@/ai/genkit';
import {
  type GetToolArgumentsInput,
  GetToolArgumentsInputSchema,
  type GetToolArgumentsOutput,
  GetToolArgumentsOutputSchema,
} from './types';

export async function getToolArguments(input: GetToolArgumentsInput): Promise<GetToolArgumentsOutput> {
  return getToolArgumentsFlow(input);
}

const getToolArgumentsPrompt = ai.definePrompt({
  name: 'getToolArgumentsPrompt',
  input: {schema: GetToolArgumentsInputSchema},
  output: {schema: GetToolArgumentsOutputSchema},
  prompt: `You are an expert at extracting structured data from natural language. Your task is to extract the arguments for a tool call from a given user prompt.

The user's prompt is:
"{{{prompt}}}"

You must provide the arguments as a JSON object that conforms to the following JSON schema:
{{{json schema}}}

Only return the JSON object, with no other text or explanation.`,
});

const getToolArgumentsFlow = ai.defineFlow(
  {
    name: 'getToolArgumentsFlow',
    inputSchema: GetToolArgumentsInputSchema,
    outputSchema: GetToolArgumentsOutputSchema,
  },
  async (input) => {
    // The AI prompt needs the schema as a string, so we stringify it here.
    const llmRequest = {
        prompt: input.prompt,
        schema: JSON.stringify(input.schema),
    };
    const {output} = await getToolArgumentsPrompt(llmRequest);
    return output!;
  }
);
