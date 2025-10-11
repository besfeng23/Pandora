
"use server";

import { getPersonalizedRecommendations as getPersonalizedRecommendationsFlow } from "@/ai/flows/personalized-recommendations";
import { naturalLanguageLogQuery as naturalLanguageLogQueryFlow } from "@/ai/flows/natural-language-log-query";
import { predictAlert as predictAlertFlow } from "@/ai/flows/predictive-alerting";
import { performRootCauseAnalysis as rootCauseAnalysisFlow } from "@/ai/flows/root-cause-analysis";
import { automatedCodeReview as automatedCodeReviewFlow } from "@/ai/flows/automated-code-review";
import { cloudWastageDetection as cloudWastageDetectionFlow } from "@/ai/flows/cloud-wastage-detection";
import { predictEquipmentFailure as predictEquipmentFailureFlow } from "@/ai/flows/predictive-maintenance";
import { getToolArguments as getToolArgumentsFlow } from "@/ai/flows/get-tool-arguments";

import type { 
    PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput,
    NaturalLanguageLogQueryInput, NaturalLanguageLogQueryOutput,
    PredictiveAlertInput, PredictiveAlertOutput,
    RootCauseAnalysisInput, RootCauseAnalysisOutput,
    AutomatedCodeReviewInput, AutomatedCodeReviewOutput,
    CloudWastageDetectionInput, CloudWastageDetectionOutput,
    PredictiveMaintenanceInput, PredictiveMaintenanceOutput,
    GetToolArgumentsInput, GetToolArgumentsOutput
} from "@/ai/flows/types";

// Helper to wrap Genkit flows with error handling.
async function handleFlow<I, O>(flow: (input: I) => Promise<O>, input: I, defaultOnError: O): Promise<O> {
    try {
        return await flow(input);
    } catch (error) {
        console.error(`Error in flow ${flow.name}:`, error);
        return defaultOnError;
    }
}

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
    return handleFlow(getPersonalizedRecommendationsFlow, input, { recommendations: [], reasoning: "Could not retrieve recommendations at this time." });
}

export async function queryLogs(input: NaturalLanguageLogQueryInput): Promise<{ results: any[] }> {
    const result = await handleFlow(naturalLanguageLogQueryFlow, input, { results: "[]" });
    try {
      if (typeof result.results === 'string') {
        const parsed = JSON.parse(result.results);
         // The AI can return the array directly or nested in a `results` property.
        const logs = Array.isArray(parsed) ? parsed : (parsed.results || []);
        return { results: logs };
      }
      if (Array.isArray(result.results)) {
        return { results: result.results };
      }
      return { results: [] };
    } catch (e) {
        console.error("Failed to parse AI log query results:", e, "Raw result:", result.results);
        return { results: [] }; // Return empty array on parsing failure
    }
}


export async function predictiveAlert(input: PredictiveAlertInput): Promise<PredictiveAlertOutput | null> {
    return handleFlow(predictAlertFlow, input, null);
}

export async function rootCauseAnalysis(input: RootCauseAnalysisInput): Promise<RootCauseAnalysisOutput | null> {
    return handleFlow(rootCauseAnalysisFlow, input, null);
}

export async function performRootCauseAnalysis(input: RootCauseAnalysisInput): Promise<RootCauseAnalysisOutput> {
    return handleFlow(rootCauseAnalysisFlow, input, { potentialRootCause: "Could not determine root cause.", supportingEvidence: "N/A" });
}

export async function automatedCodeReview(input: AutomatedCodeReviewInput): Promise<AutomatedCodeReviewOutput> {
    return handleFlow(automatedCodeReviewFlow, input, { securityIssues: [], performanceIssues: [], suggestions: ["Could not review code at this time."] });
}

export async function cloudWastageDetection(input: CloudWastageDetectionInput): Promise<CloudWastageDetectionOutput> {
    return handleFlow(cloudWastageDetectionFlow, input, { idleResources: [] });
}

export async function predictEquipmentFailure(input: PredictiveMaintenanceInput): Promise<PredictiveMaintenanceOutput | null> {
    return handleFlow(predictEquipmentFailureFlow, input, null);
}

export async function getToolArguments(input: GetToolArgumentsInput): Promise<GetToolArgumentsOutput | null> {
    return handleFlow(getToolArgumentsFlow, input, null);
}
