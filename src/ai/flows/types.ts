/**
 * @fileOverview This file contains all the Zod schemas and TypeScript types for the AI helper flows.
 */

import { z } from 'zod';

// === anomaly-detection-system.ts ===
export const AnomalyDetectionInputSchema = z.object({
  systemLogs: z.string().describe('System logs to analyze.'),
  systemMetrics: z.string().describe('System metrics data to analyze.'),
});
export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

export const AnomalyDetectionOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether anomalous behavior is detected.'),
  anomalyDescription: z
    .string()
    .describe('A description of the detected anomaly, if any.'),
});
export type AnomalyDetectionOutput = z.infer<typeof AnomalyDetectionOutputSchema>;


// === automated-code-review.ts ===
export const AutomatedCodeReviewInputSchema = z.object({
  code: z.string().describe('The code to be reviewed.'),
  language: z.string().describe('The programming language of the code.'),
  securityBestPractices: z
    .string()
    .optional()
    .describe('Security best practices to consider during the review.'),
  performanceBestPractices: z
    .string()
    .optional()
    .describe('Performance best practices to consider during the review.'),
});
export type AutomatedCodeReviewInput = z.infer<typeof AutomatedCodeReviewInputSchema>;

export const AutomatedCodeReviewOutputSchema = z.object({
  securityIssues: z
    .array(z.string())
    .describe('A list of potential security issues found in the code.'),
  performanceIssues: z
    .array(z.string())
    .describe('A list of potential performance issues found in the code.'),
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to improve the code.'),
});
export type AutomatedCodeReviewOutput = z.infer<typeof AutomatedCodeReviewOutputSchema>;


// === cloud-wastage-detection.ts ===
export const CloudWastageDetectionInputSchema = z.object({
  cloudProvider: z.enum(['vercel', 'firebase']).describe('The supported platform (vercel or firebase).'),
  accountId: z.string().describe('The deployment or project identifier.'),
  region: z.string().describe('The region to analyze (e.g., iad1 for Vercel, us-central1 for Firebase).'),
  resourceTypes: z
    .array(z.string())
    .describe('The types of resources to analyze (e.g., functions, firestore collections, edge config).'),
  costThreshold: z
    .number()
    .optional()
    .describe('The cost threshold above which resources are considered for optimization.'),
});
export type CloudWastageDetectionInput = z.infer<typeof CloudWastageDetectionInputSchema>;

export const CloudWastageDetectionOutputSchema = z.object({
  idleResources: z
    .array(
      z.object({
        resourceId: z.string().describe('The ID of the idle resource.'),
        resourceType: z.string().describe('The type of the idle resource.'),
        estimatedWastedCost: z.number().describe('The estimated wasted cost for the resource.'),
        recommendation: z.string().describe('A suggestion to optimize the resource utilization.'),
        evidence: z.array(z.string()).describe('Links to metrics/events that provide evidence for the recommendation.'),
        relevanceScore: z.number().describe('A score indicating the relevance of the recommendation (0-1).'),
      })
    )
    .describe('A list of idle cloud resources and optimization suggestions.'),
});
export type CloudWastageDetectionOutput = z.infer<typeof CloudWastageDetectionOutputSchema>;


// === get-tool-arguments.ts ===
export const GetToolArgumentsInputSchema = z.object({
  prompt: z.string().describe('The natural language prompt from the user.'),
  schema: z.any().describe('The JSON schema for the arguments of the tool to be called.'),
});
export type GetToolArgumentsInput = z.infer<typeof GetToolArgumentsInputSchema>;

export const GetToolArgumentsOutputSchema = z.any().describe('A JSON object containing the extracted arguments that conform to the provided schema.');
export type GetToolArgumentsOutput = z.infer<typeof GetToolArgumentsOutputSchema>;


// === natural-language-log-query.ts ===
export const NaturalLanguageLogQueryInputSchema = z.object({
  query: z.string().describe('The natural language query to use to search the logs.'),
  logs: z.string().describe('The logs to search through in JSON format.'),
});
export type NaturalLanguageLogQueryInput = z.infer<typeof NaturalLanguageLogQueryInputSchema>;

export const NaturalLanguageLogQueryOutputSchema = z.object({
  results: z.string().describe('The logs that match the query, returned as a JSON string of an array of log objects.'),
});
export type NaturalLanguageLogQueryOutput = z.infer<typeof NaturalLanguageLogQueryOutputSchema>;


// === personalized-recommendations.ts ===
export const PersonalizedRecommendationsInputSchema = z.object({
  userNeeds: z.string().describe('The user needs.'),
  userPreferences: z.string().describe('The user preferences.'),
  systemState: z.string().describe('The current system state.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

export const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of personalized recommendations.'),
  reasoning: z.string().describe('The reasoning behind the recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;


// === predictive-alerting.ts ===
export const PredictiveAlertInputSchema = z.object({
  metricName: z.string().describe('The name of the metric to predict alerts for.'),
  currentValue: z.number().describe('The current value of the metric.'),
  trendData: z
    .array(z.number())
    .describe(
      'An array of historical data points for the metric, representing the trend.'
    ),
  threshold: z
    .number()
    .describe('The threshold value that triggers the alert.'),
  timeWindow: z
    .string()
    .describe(
      'The time window over which the trend data is collected, e.g., "1 hour", "1 day".'
    ),
});
export type PredictiveAlertInput = z.infer<typeof PredictiveAlertInputSchema>;

export const PredictiveAlertOutputSchema = z.object({
  predictedFiringTime: z
    .string()
    .describe(
      'An ISO timestamp string indicating the predicted time the alert will fire, or null if it is not predicted to fire within the observable window.'
    )
    .nullable(),
  confidenceLevel: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level of the prediction.'
    ),
  suggestedThresholdAdjustment: z
    .number()
    .describe(
      'A suggested adjustment to the threshold value to prevent false positives or missed alerts.'
    ),
  explanation: z
    .string()
    .describe(
      'An explanation of why the alert is predicted to fire and the reasoning behind the suggested threshold adjustment.'
    ),
});
export type PredictiveAlertOutput = z.infer<typeof PredictiveAlertOutputSchema>;


// === predictive-cost-recommendations.ts ===
export const PredictiveCostRecommendationsInputSchema = z.object({
  cloudProvider: z.enum(['vercel', 'firebase']).describe('The supported platform (vercel or firebase).'),
  resourceType: z.string().describe('The type of resource (e.g., Vercel deployment, Firebase function, Firestore).'),
  usageData: z.string().describe('JSON string containing historical usage data for the resource.'),
  costData: z.string().describe('JSON string containing historical cost data for the resource.'),
  currentConfiguration: z.string().describe('JSON string containing current configuration details of the resource.'),
});
export type PredictiveCostRecommendationsInput = z.infer<typeof PredictiveCostRecommendationsInputSchema>;

export const PredictiveCostRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      type: z.string().describe('The type of recommendation (e.g., instance resizing, reserved instance purchase).'),
      description: z.string().describe('A detailed description of the recommendation.'),
      estimatedSavings: z.number().describe('The estimated cost savings per month.'),
      priority: z.enum(['high', 'medium', 'low']).describe('The priority of the recommendation.'),
      evidence: z.string().optional().describe('Links to evidence supporting the recommendation.'),
    })
  ).describe('A list of cost optimization recommendations.'),
  analysis: z.string().describe('AI analysis of the cloud cost data.'),
});
export type PredictiveCostRecommendationsOutput = z.infer<typeof PredictiveCostRecommendationsOutputSchema>;


// === predictive-maintenance.ts ===
export const PredictiveMaintenanceInputSchema = z.object({
  equipmentType: z.string().describe('Type of equipment being monitored.'),
  equipmentId: z.string().describe('Unique identifier for the equipment.'),
  historicalData: z.string().describe('Historical performance data of the equipment in JSON format.'),
  maintenanceLogs: z.string().describe('Maintenance logs for the equipment in JSON format.'),
});
export type PredictiveMaintenanceInput = z.infer<typeof PredictiveMaintenanceInputSchema>;

export const PredictiveMaintenanceOutputSchema = z.object({
  failurePrediction: z.object({
    predictedFailure: z.boolean().describe('Whether or not a failure is predicted.'),
    failureProbability: z.number().describe('Probability of failure occurring (0-1).'),
    estimatedTimeToFailure: z.string().describe('Estimated time until failure.'),
    failureReason: z.string().describe('Reason for the predicted failure.'),
  }),
  maintenanceRecommendation: z.object({
    recommendedActions: z.array(z.string()).describe('List of recommended maintenance actions.'),
    priority: z.string().describe('Priority of the recommended maintenance (e.g., High, Medium, Low).'),
    justification: z.string().describe('Justification for the recommended maintenance.'),
  }),
});
export type PredictiveMaintenanceOutput = z.infer<typeof PredictiveMaintenanceOutputSchema>;


// === risk-based-alerting.ts ===
export const RiskBasedAlertingInputSchema = z.object({
  alertDescription: z.string().describe('A description of the alert.'),
  potentialImpact: z.string().describe('The potential impact of the alert (e.g., high, medium, low).'),
  likelihoodOfOccurrence: z.string().describe('The likelihood of the alert occurring (e.g., high, medium, low).'),
});
export type RiskBasedAlertingInput = z.infer<typeof RiskBasedAlertingInputSchema>;

export const RiskBasedAlertingOutputSchema = z.object({
  priorityScore: z.number().describe('A numerical score representing the priority of the alert.'),
  rationale: z.string().describe('The rationale behind the assigned priority score.'),
});
export type RiskBasedAlertingOutput = z.infer<typeof RiskBasedAlertingOutputSchema>;


// === root-cause-analysis.ts ===
export const RootCauseAnalysisInputSchema = z.object({
  incidentDescription: z
    .string()
    .describe('A detailed description of the incident, including symptoms, affected systems, and any relevant logs or metrics.'),
});
export type RootCauseAnalysisInput = z.infer<typeof RootCauseAnalysisInputSchema>;

export const RootCauseAnalysisOutputSchema = z.object({
  potentialRootCause: z
    .string()
    .describe('A concise explanation of the most likely root cause of the incident.'),
  supportingEvidence: z
    .string()
    .optional()
    .describe('Optional: Any specific logs, metrics, or events that support the identified root cause.'),
});
export type RootCauseAnalysisOutput = z.infer<typeof RootCauseAnalysisOutputSchema>;
