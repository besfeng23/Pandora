'use server';

import {
  AutomatedCodeReviewInputSchema,
  type AutomatedCodeReviewInput,
  type AutomatedCodeReviewOutput,
} from './types';

const SECURITY_SMELLS = [
  { match: /eval\s*\(/i, message: 'Avoid eval; prefer safe parsers or whitelisted operations.' },
  { match: /innerHTML\s*=/i, message: 'Direct innerHTML assignment can lead to XSS; sanitize first.' },
  { match: /any/g, message: 'TypeScript any hides unsafe data paths; prefer precise types.' },
];

const PERFORMANCE_SMELLS = [
  { match: /for\s*\(\s*var\s/i, message: 'Prefer const/let and array helpers for clarity and safety.' },
  { match: /console\.log/g, message: 'Drop verbose logging in production hot paths.' },
  { match: /setInterval\s*\(/i, message: 'Ensure intervals are cleared to avoid leaks.' },
];

export async function automatedCodeReview(
  input: AutomatedCodeReviewInput,
): Promise<AutomatedCodeReviewOutput> {
  const parsed = AutomatedCodeReviewInputSchema.parse(input);
  const code = parsed.code;

  const securityIssues = SECURITY_SMELLS.filter(({ match }) => match.test(code)).map(
    issue => issue.message,
  );
  const performanceIssues = PERFORMANCE_SMELLS.filter(({ match }) => match.test(code)).map(
    issue => issue.message,
  );

  const suggestions = [
    ...(securityIssues.length ? ['Add input validation and escape user-controlled values.'] : []),
    ...(performanceIssues.length ? ['Profile the hottest loops and debounce noisy logs.'] : []),
    'Ensure lint/typecheck gates run in CI before merge.',
  ];

  return { securityIssues, performanceIssues, suggestions };
}

